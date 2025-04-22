import { Request, Response } from 'express';
import { adminService } from '../../services/adminService';

/**
 * Controller class for admin operations
 * Handles HTTP requests related to admin functionality
 */
export class AdminController {
  /**
   * @desc    Get all users
   * @route   GET /api/admin/users
   * @access  Private (Admin only)
   */
  async getAllUsers(_: Request, res: Response): Promise<void> {
    try {
      const users = await adminService.getAllUsers();
      
      res.status(200).json({
        success: true,
        count: users.length,
        data: users
      });
    } catch (error: any) {
      console.error('Error getting users:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Error retrieving users'
      });
    }
  }

  /**
   * @desc    Get user by ID
   * @route   GET /api/admin/users/:id
   * @access  Private (Admin only)
   */
  async getUserById(req: Request, res: Response): Promise<void> {
    try {
      const userId = parseInt(req.params.id);
      if (isNaN(userId)) {
        res.status(400).json({
          success: false,
          message: 'Invalid user ID'
        });
        return;
      }

      const userData = await adminService.getUserById(userId);
      
      res.status(200).json({
        success: true,
        data: userData
      });
    } catch (error: any) {
      console.error('Error getting user:', error);
      
      const statusCode = error.message.includes('not found') ? 404 : 500;
      
      res.status(statusCode).json({
        success: false,
        message: error.message || 'Error retrieving user'
      });
    }
  }

  /**
   * @desc    Get all customers
   * @route   GET /api/admin/customers
   * @access  Private (Admin only)
   */
  async getAllCustomers(_: Request, res: Response): Promise<void> {
    try {
      const customers = await adminService.getAllCustomers();
      
      res.status(200).json({
        success: true,
        count: customers.length,
        data: customers
      });
    } catch (error: any) {
      console.error('Error getting customers:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Error retrieving customers'
      });
    }
  }

  /**
   * @desc    Update user status (active/inactive)
   * @route   PATCH /api/admin/users/:id/status
   * @access  Private (Admin only)
   */
  async updateUserStatus(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user?.id) {
        res.status(401).json({
          success: false,
          message: 'Not authenticated'
        });
        return;
      }

      const userId = parseInt(req.params.id);
      const { isActive } = req.body;
      
      if (isNaN(userId) || typeof isActive !== 'boolean') {
        res.status(400).json({
          success: false,
          message: 'Invalid request parameters'
        });
        return;
      }

      const userData = await adminService.updateUserStatus(userId, isActive, req.user.id);
      
      res.status(200).json({
        success: true,
        message: `User ${isActive ? 'activated' : 'deactivated'} successfully`,
        data: userData
      });
    } catch (error: any) {
      console.error('Error updating user status:', error);
      
      // Different status codes based on error type
      let statusCode = 500;
      if (error.message.includes('not found')) {
        statusCode = 404;
      } else if (error.message.includes('Cannot deactivate')) {
        statusCode = 403;
      }
      
      res.status(statusCode).json({
        success: false,
        message: error.message || 'Error updating user status'
      });
    }
  }

  /**
   * @desc    Get dashboard statistics
   * @route   GET /api/admin/dashboard
   * @access  Private (Admin only)
   */
  async getDashboardStats(_: Request, res: Response): Promise<void> {
    try {
      const stats = await adminService.getDashboardStats();
      
      res.status(200).json({
        success: true,
        data: stats
      });
    } catch (error: any) {
      console.error('Error getting dashboard stats:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Error retrieving dashboard statistics'
      });
    }
  }
}

// Export singleton instance
export const adminController = new AdminController();