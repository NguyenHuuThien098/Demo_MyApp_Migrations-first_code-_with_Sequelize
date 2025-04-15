import express from 'express';
import { OrderController } from '../controller/order/orderController';

const router = express.Router();
const orderController = new OrderController();

// TĨNH
router.get('/customer-rankings', orderController.getCustomerRankingByYear.bind(orderController));// Lấy danh sách xếp hạng khách hàng theo doanh số từng năm
router.get('/top-second', orderController.getSecondHighestOrderDaysPerMonth.bind(orderController));// Lấy danh sách các ngày có số lượng đơn hàng cao thứ hai trong mỗi tháng
router.get('/no-orders', orderController.getDaysWithoutOrders.bind(orderController));// Lấy danh sách các ngày không có đơn hàng nào được đặt
router.get('/customers', orderController.getOrdersWithCustomerInfo.bind(orderController));// Lấy danh sách các đơn hàng kèm thông tin khách hàng
router.get('/customer/:customerId', orderController.getOrdersByCustomerId.bind(orderController));// Lấy danh sách các đơn hàng của một khách hàng cụ thể theo ID khách hàng
router.get('/details', orderController.getOrderDetails.bind(orderController));// Lấy thông tin chi tiết của các đơn hàng (tên khách hàng, shipper, tổng tiền)
router.get('/total-by-country', orderController.getTotalAmountByCountry.bind(orderController));// Lấy tổng số tiền đơn hàng của mỗi quốc gia, sắp xếp theo thứ tự giảm dần
router.get('/', orderController.getOrders.bind(orderController));// Lấy danh sách tất cả các đơn hàng
router.get('/total-greater-than-1000', orderController.getOrdersWithTotalAmountGreaterThan1000.bind(orderController));// Lấy danh sách các đơn hàng có tổng tiền lớn hơn 1000

//Động
router.get('/:id', orderController.getOrderById.bind(orderController));// Lấy thông tin chi tiết của order qua id

// CRUD
router.post('/', orderController.createOrder.bind(orderController));// Tạo mới 1 đơn hàng
router.delete('/:id', orderController.deleteOrderById.bind(orderController));// Xóa order theo id

export default router;