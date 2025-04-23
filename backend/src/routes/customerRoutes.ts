import express from 'express';
import { CustomerController } from '../controller/customer/customerController';
import { OrderController } from '../controller/order/orderController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();
const customerController = new CustomerController();
const orderController = new OrderController();

// Công khai - không yêu cầu xác thực
router.get('/search', customerController.searchCustomers.bind(customerController)); // API tìm kiếm khách hàng có phân trang

router.post('/order-product', protect, orderController.orderProductById.bind(orderController));

// Để đảm bảo mọi chức năng khác yêu cầu xác thực
// router.use(protect);

export default router;