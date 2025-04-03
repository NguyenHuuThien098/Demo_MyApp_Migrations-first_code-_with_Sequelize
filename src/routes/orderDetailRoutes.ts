import express from 'express';
import { getOrderDetails, getOrderDetailById, createOrderDetail, deleteOrderDetailById } from '../controller/orderDetail/orderDetailController';

const router = express.Router();

// Định nghĩa các route cho OrderDetails
router.get('/', getOrderDetails);
router.get('/:id', getOrderDetailById);
router.post('/', createOrderDetail);
router.delete('/:id', deleteOrderDetailById);

export default router;