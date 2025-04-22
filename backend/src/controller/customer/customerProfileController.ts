import { Request, Response } from 'express';
import { customerService } from '../../services/customerService';

/**
 * Controller for handling customer profile operations
 * Uses CustomerService for business logic
 */
export class CustomerProfileController {
  /**
   * @desc    Get customer profile
   * @route   GET /api/customer/profile
   * @access  Private (Customer only)
   */
  async getProfile(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user?.id) {
        res.status(401).json({
          success: false,
          message: 'Not authenticated'
        });
        return;
      }

      const customerProfile = await customerService.getCustomerProfile(req.user.id);

      res.status(200).json({
        success: true,
        data: customerProfile
      });
    } catch (error: any) {
      console.error('Error getting customer profile:', error);
      
      // Return 404 if profile not found, 500 for other errors
      const statusCode = error.message.includes('not found') ? 404 : 500;
      
      res.status(statusCode).json({
        success: false,
        message: error.message || 'Error retrieving customer profile'
      });
    }
  }

  /**
   * @desc    Update customer profile
   * @route   PUT /api/customer/profile
   * @access  Private (Customer only)
   */
  async updateProfile(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user?.id) {
        res.status(401).json({
          success: false,
          message: 'Not authenticated'
        });
        return;
      }

      const { name, contactName, country } = req.body;
      
      const updatedProfile = await customerService.updateCustomerProfile(
        req.user.id, 
        { name, contactName, country }
      );

      res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        data: updatedProfile
      });
    } catch (error: any) {
      console.error('Error updating customer profile:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Error updating customer profile'
      });
    }
  }

  /**
   * @desc    Get customer order history
   * @route   GET /api/customer/orders
   * @access  Private (Customer only)
   */
  async getOrderHistory(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user?.id) {
        res.status(401).json({
          success: false,
          message: 'Not authenticated'
        });
        return;
      }

      const orderData = await customerService.getCustomerOrders(req.user.id);

      res.status(200).json({
        success: true,
        data: orderData
      });
    } catch (error: any) {
      console.error('Error getting order history:', error);
      
      const statusCode = error.message.includes('not found') ? 404 : 500;
      
      res.status(statusCode).json({
        success: false,
        message: error.message || 'Error retrieving order history'
      });
    }
  }

  /**
   * @desc    Get specific order details
   * @route   GET /api/customer/orders/:id
   * @access  Private (Customer only)
   */
  async getOrderDetail(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user?.id) {
        res.status(401).json({
          success: false,
          message: 'Not authenticated'
        });
        return;
      }

      const orderId = parseInt(req.params.id);
      if (isNaN(orderId)) {
        res.status(400).json({
          success: false,
          message: 'Invalid order ID'
        });
        return;
      }

      const order = await customerService.getCustomerOrder(req.user.id, orderId);

      res.status(200).json({
        success: true,
        data: order
      });
    } catch (error: any) {
      console.error('Error getting order details:', error);
      
      // Different status codes based on error type
      let statusCode = 500;
      if (error.message.includes('not found')) {
        statusCode = 404;
      }
      
      res.status(statusCode).json({
        success: false,
        message: error.message || 'Error retrieving order details'
      });
    }
  }
}

// Export singleton instance
export const customerProfileController = new CustomerProfileController();

// Export method references for backward compatibility
export const getProfile = customerProfileController.getProfile.bind(customerProfileController);
export const updateProfile = customerProfileController.updateProfile.bind(customerProfileController);
export const getOrderHistory = customerProfileController.getOrderHistory.bind(customerProfileController);
export const getOrderDetail = customerProfileController.getOrderDetail.bind(customerProfileController);