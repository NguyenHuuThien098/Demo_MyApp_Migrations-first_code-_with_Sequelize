import express from 'express';
import { customerProfileController } from '../controller/customer/customerProfileController';
import { protect, authorizeRole } from '../middleware/authMiddleware';
import { OrderController } from '../controller/order/orderController';

const router = express.Router();
const orderController = new OrderController();

/**
 * Customer Profile Routes
 * All routes require customer role
 */

// Customer profile management
router.get('/profile', protect, authorizeRole(['customer']), customerProfileController.getProfile.bind(customerProfileController));
router.put('/profile', protect, authorizeRole(['customer']), customerProfileController.updateProfile.bind(customerProfileController));

// Customer orders management
router.get('/orders', protect, authorizeRole(['customer']), customerProfileController.getOrderHistory.bind(customerProfileController));
router.get('/orders/:id', protect, authorizeRole(['customer']), customerProfileController.getOrderDetail.bind(customerProfileController));
router.post('/order-product', protect, orderController.orderProductById.bind(orderController));

export default router;