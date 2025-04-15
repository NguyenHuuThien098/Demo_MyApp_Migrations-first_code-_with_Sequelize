// routes/orderRoutes.ts
import express from 'express';
import {
  getOrders,
  getOrderById,
  createOrder,
  deleteOrderById,
} from '../controller/order/orderController';

import {
  getOrdersByCustomerId,
  getOrdersWithCustomerInfo,
  getCustomerRankingByYear,
} from '../controller/order/orderController';

import {
  getDaysWithoutOrders,
  getSecondHighestOrderDaysPerMonth,
} from '../controller/order/orderController';

const router = express.Router();

// --- ROUTES TĨNH ---
router.get('/customer-rankings', getCustomerRankingByYear);
router.get('/top-second', getSecondHighestOrderDaysPerMonth);
router.get('/no-orders', getDaysWithoutOrders);
router.get('/customers', getOrdersWithCustomerInfo);
router.get('/customer/:customerId', getOrdersByCustomerId);

// --- CRUD ĐƠN HÀNG ---
router.get('/', getOrders);
router.post('/', createOrder);

// --- ROUTE ĐỘNG: Đặt sau cùng để tránh nhầm lẫn ---
router.get('/:id', getOrderById);
router.delete('/:id', deleteOrderById);

export default router;
