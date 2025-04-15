import express from 'express';
import { getOrderDetails, getOrderDetailById, createOrderDetail, deleteOrderDetailById, getOrderDetailsByOrderId } from '../controller/orderDetail/orderDetailController';

const router = express.Router();

router.get('/by-order/:orderId', getOrderDetailsByOrderId);

// Định nghĩa các route cho OrderDetails
//TĨNH
router.get('/', getOrderDetails);

//ĐỘNG
router.get('/:id', getOrderDetailById);

//CRUD
router.post('/', createOrderDetail);
router.delete('/:id', deleteOrderDetailById);

export default router;