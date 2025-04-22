import db from '../models/index';

/**
 * Customer Service Class
 * Handles business logic for customer profile operations
 */
export class CustomerService {
  /**
   * Get customer profile with user data
   * @param userId User ID associated with the customer
   */
  async getCustomerProfile(userId: number) {
    // Find customer with associated user data
    const customer = await db.Customer.findOne({
      where: { UserId: userId },
      include: [
        {
          model: db.User,
          attributes: ['id', 'username', 'email', 'fullName', 'isActive', 'lastLogin']
        }
      ]
    });

    if (!customer) {
      throw new Error('Customer profile not found');
    }

    return customer;
  }

  /**
   * Update or create customer profile
   * @param userId User ID associated with the customer
   * @param customerData Customer data to update
   */
  async updateCustomerProfile(userId: number, customerData: any) {
    const { name, contactName, country } = customerData;

    // Check if user exists
    const user = await db.User.findByPk(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Check if customer profile already exists
    let customer = await db.Customer.findOne({ 
      where: { UserId: userId } 
    });

    if (customer) {
      // Update existing customer
      await customer.update({
        name: name || customer.name,
        contactName: contactName || customer.contactName,
        country: country || customer.country
      });
    } else {
      // Create new customer profile
      customer = await db.Customer.create({
        name: name || user.fullName,
        contactName: contactName || name || user.fullName,
        country: country || '',
        UserId: userId
      });
    }

    return customer;
  }

  /**
   * Get customer orders with details
   * @param userId User ID associated with the customer
   */
  async getCustomerOrders(userId: number) {
    // Find customer by userId
    const customer = await db.Customer.findOne({
      where: { UserId: userId }
    });

    if (!customer) {
      throw new Error('Customer profile not found');
    }

    // Get orders with details
    const orders = await db.Order.findAll({
      where: { CustomerId: customer.id },
      include: [
        {
          model: db.OrderDetail,
          include: [
            {
              model: db.Product,
              attributes: ['id', 'Name', 'UnitPrice', 'product_code']
            }
          ]
        },
        {
          model: db.Shipper,
          attributes: ['id', 'Name', 'shipper_code']
        }
      ],
      order: [['OrderDate', 'DESC']]
    });

    return { customerId: customer.id, orders };
  }

  /**
   * Get a specific customer order
   * @param userId User ID associated with the customer
   * @param orderId Order ID to retrieve
   */
  async getCustomerOrder(userId: number, orderId: number) {
    // Find customer by userId
    const customer = await db.Customer.findOne({
      where: { UserId: userId }
    });

    if (!customer) {
      throw new Error('Customer profile not found');
    }

    // Get specific order with details
    const order = await db.Order.findOne({
      where: { 
        id: orderId,
        CustomerId: customer.id 
      },
      include: [
        {
          model: db.OrderDetail,
          include: [
            {
              model: db.Product,
              attributes: ['id', 'Name', 'UnitPrice', 'product_code', 'quantity']
            }
          ]
        },
        {
          model: db.Shipper,
          attributes: ['id', 'Name', 'shipper_code']
        }
      ]
    });

    if (!order) {
      throw new Error('Order not found or not belonging to this customer');
    }

    return order;
  }

  
}

// Export singleton instance
export const customerService = new CustomerService();