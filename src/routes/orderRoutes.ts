import express from 'express';
import { getOrders, getOrderById, createOrder, deleteOrderById } from '../controller/order/orderController';

const router = express.Router();

// Định nghĩa các route cho Orders
router.get('/', getOrders);
router.get('/:id', getOrderById);
router.post('/', createOrder);
router.delete('/:id', deleteOrderById);

export default router;