import db from '../models/index';
import { Op } from 'sequelize';

/**
 * Admin Service Class
 * Handles business logic for admin operations
 */
export class AdminService {
  /**
   * Get all users
   */
  async getAllUsers() {
    const users = await db.User.findAll({
      attributes: { exclude: ['password', 'refreshToken'] }
    });
    
    return users;
  }

  /**
   * Get user by ID with detailed information
   * @param userId User ID to retrieve
   */
  async getUserById(userId: number) {
    const user = await db.User.findByPk(userId, {
      attributes: { exclude: ['password', 'refreshToken'] }
    });
    
    if (!user) {
      throw new Error('User not found');
    }
    
    // Get related information based on user role
    let additionalInfo = null;
    if (user.role === 'customer') {
      additionalInfo = await db.Customer.findOne({
        where: { UserId: userId }
      });
    }
    
    return { user, additionalInfo };
  }
  
  /**
   * Get all customers with their user information
   */
  async getAllCustomers() {
    const customers = await db.Customer.findAll({
      include: [
        {
          model: db.User,
          attributes: ['id', 'username', 'email', 'fullName', 'isActive', 'lastLogin'],
          where: { role: 'customer' } // Only include users with customer role
        }
      ]
    });
    
    return customers;
  }

  /**
   * Update user status (active/inactive)
   * @param userId User ID to update
   * @param isActive New active status
   * @param adminId ID of admin performing the action
   */
  async updateUserStatus(userId: number, isActive: boolean, adminId: number) {
    // Prevent admin from deactivating themselves
    if (userId === adminId && !isActive) {
      throw new Error('Cannot deactivate your own account');
    }
    
    const user = await db.User.findByPk(userId);
    
    if (!user) {
      throw new Error('User not found');
    }
    
    await user.update({ isActive });
    
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      isActive: user.isActive
    };
  }

  /**
   * Get dashboard statistics
   */
  async getDashboardStats() {
    // Users stats
    const totalUsers = await db.User.count();
    const activeUsers = await db.User.count({ where: { isActive: true } });
    
    // Customers stats
    const totalCustomers = await db.Customer.count();
    
    // Product stats
    const totalProducts = await db.Product.count();
    const lowStockProducts = await db.Product.count({
      where: { quantity: { [Op.lt]: 10 } } // Products with quantity less than 10
    });
    
    // Order stats
    const totalOrders = await db.Order.count();
    
    // Recent orders
    const recentOrders = await db.Order.findAll({
      limit: 10,
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: db.Customer,
          attributes: ['id', 'name', 'contactName']
        },
        {
          model: db.Shipper,
          attributes: ['id', 'Name']
        }
      ]
    });
    
    // Calculate total revenue
    const orderDetails = await db.OrderDetail.findAll({
      include: [{
        model: db.Product,
        attributes: ['UnitPrice']
      }]
    });
    
    const totalRevenue = orderDetails.reduce((sum: number, detail: any) => {
      return sum + (detail.Quantity * detail.Price);
    }, 0);
    
    // Get statistics for current month
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    const ordersThisMonth = await db.Order.count({
      where: {
        createdAt: {
          [Op.gte]: startOfMonth
        }
      }
    });
    
    return {
      users: {
        total: totalUsers,
        active: activeUsers
      },
      customers: {
        total: totalCustomers
      },
      products: {
        total: totalProducts,
        lowStock: lowStockProducts
      },
      orders: {
        total: totalOrders,
        thisMonth: ordersThisMonth
      },
      revenue: {
        total: totalRevenue
      },
      recentOrders
    };
  }
}

// Export singleton instance
export const adminService = new AdminService();