import express from 'express';
import { OrderDetailController } from '../controller/orderDetail/orderDetailController';

const router = express.Router();
const orderDetailController = new OrderDetailController();
// TĨNH
router.get('/by-order/:orderId', orderDetailController.getOrderDetailsByOrderId.bind(orderDetailController));// Lấy danh sách các chi tiết đơn hàng theo ID đơn hàng
router.get('/', orderDetailController.getOrderDetails.bind(orderDetailController));// Lấy danh sách tất cả các chi tiết đơn hàng

// ĐỘNG
router.get('/:id', orderDetailController.getOrderDetailById.bind(orderDetailController));// Lấy thông tin chi tiết order thông qua id

// CRUD
router.post('/', orderDetailController.createOrderDetail.bind(orderDetailController));// Tạo mới chi tiết đơn hàng
router.delete('/:id', orderDetailController.deleteOrderDetailById.bind(orderDetailController));// Xóa một chi tiết đơn hàng theo ID

export default router;