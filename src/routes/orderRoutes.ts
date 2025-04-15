// // routes/orderRoutes.ts
// import express from 'express';
// import {
//   getOrders,
//   getOrderById,
//   createOrder,
//   deleteOrderById,
// } from '../controller/order/orderController';

// import {
//   getOrdersByCustomerId,
//   getOrdersWithCustomerInfo,
//   getCustomerRankingByYear,
// } from '../controller/order/orderController';

// import {
//   getDaysWithoutOrders,
//   getSecondHighestOrderDaysPerMonth,
// } from '../controller/order/orderController';

// const router = express.Router();

// // --- ROUTES TĨNH ---
// router.get('/customer-rankings', getCustomerRankingByYear);
// router.get('/top-second', getSecondHighestOrderDaysPerMonth);
// router.get('/no-orders', getDaysWithoutOrders);
// router.get('/customers', getOrdersWithCustomerInfo);
// router.get('/customer/:customerId', getOrdersByCustomerId);

// // --- CRUD ĐƠN HÀNG ---
// router.get('/', getOrders);
// router.post('/', createOrder);

// // --- ROUTE ĐỘNG: Đặt sau cùng để tránh nhầm lẫn ---
// router.get('/:id', getOrderById);
// router.delete('/:id', deleteOrderById);

// export default router;


import express from 'express';
import { OrderController } from '../controller/order/orderController';

const router = express.Router();
const orderController = new OrderController();

// TĨNH
router.get('/customer-rankings', orderController.getCustomerRankingByYear.bind(orderController));
router.get('/top-second', orderController.getSecondHighestOrderDaysPerMonth.bind(orderController));
router.get('/no-orders', orderController.getDaysWithoutOrders.bind(orderController));
router.get('/customers', orderController.getOrdersWithCustomerInfo.bind(orderController));
router.get('/customer/:customerId', orderController.getOrdersByCustomerId.bind(orderController));
router.get('/details', orderController.getOrderDetails.bind(orderController));
router.get('/total-by-country', orderController.getTotalAmountByCountry.bind(orderController));

// CRUD
router.get('/', orderController.getOrders.bind(orderController));
router.post('/', orderController.createOrder.bind(orderController));

// ĐỘNG
router.get('/:id', orderController.getOrderById.bind(orderController));
router.delete('/:id', orderController.deleteOrderById.bind(orderController));

export default router;