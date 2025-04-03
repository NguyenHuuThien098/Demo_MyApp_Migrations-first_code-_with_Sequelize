import express from 'express';
import { getOrderDetails, getOrderDetailById, createOrderDetail, deleteOrderDetailById, getOrderDetailsByOrderId } from '../controller/orderDetail/orderDetailController';

const router = express.Router();

// Định nghĩa các route cho OrderDetails
router.get('/', getOrderDetails);
router.get('/:id', getOrderDetailById);
router.post('/', createOrderDetail);
router.delete('/:id', deleteOrderDetailById);
router.get('/by-order/:orderId', getOrderDetailsByOrderId);

export default router;