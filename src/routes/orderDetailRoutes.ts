// import express from 'express';
// import { getOrderDetails, getOrderDetailById, createOrderDetail, deleteOrderDetailById, getOrderDetailsByOrderId } from '../controller/orderDetail/orderDetailController';

// const router = express.Router();

// router.get('/by-order/:orderId', getOrderDetailsByOrderId);

// // Định nghĩa các route cho OrderDetails
// //TĨNH
// router.get('/', getOrderDetails);

// //ĐỘNG
// router.get('/:id', getOrderDetailById);

// //CRUD
// router.post('/', createOrderDetail);
// router.delete('/:id', deleteOrderDetailById);

// export default router;


import express from 'express';
import { OrderDetailController } from '../controller/orderDetail/orderDetailController';

const router = express.Router();
const orderDetailController = new OrderDetailController();
// TĨNH
router.get('/by-order/:orderId', orderDetailController.getOrderDetailsByOrderId.bind(orderDetailController));
router.get('/', orderDetailController.getOrderDetails.bind(orderDetailController));

// ĐỘNG
router.get('/:id', orderDetailController.getOrderDetailById.bind(orderDetailController));

// CRUD
router.post('/', orderDetailController.createOrderDetail.bind(orderDetailController));
router.delete('/:id', orderDetailController.deleteOrderDetailById.bind(orderDetailController));

export default router;