import express from 'express';
import { CustomerController } from '../controller/customer/customerController';

const router = express.Router();
const customerController = new CustomerController();

// Định nghĩa các route cho Customers
// TĨNH
router.get('/', customerController.getCustomers.bind(customerController)); // Lấy tất cả khách hàng
router.get('/top-by-country', customerController.getTopCustomerByCountry.bind(customerController)); // Lấy thông tin khách hàng mua nhiều nhất của từng quốc gia
router.get('/total-spent', customerController.getCustomerTotalSpent.bind(customerController)); // Lấy tổng tiền phải trả của từng khách hàng
router.get('/three-months-no-orders', customerController.getCustomersWithThreeMonthsNoOrders.bind(customerController));// Lấy các khách hàng không đặt hàng trong ba tháng liên tiếp bất kỳ.

// ĐỘNG
router.get('/:id', customerController.getCustomer.bind(customerController)); // Lấy khách hàng theo ID

// CRUD
router.post('/', customerController.createCustomer.bind(customerController)); // Tạo mới khách hàng
router.delete('/:id', customerController.deleteCustomerById.bind(customerController)); // Xóa khách hàng theo ID

export default router;