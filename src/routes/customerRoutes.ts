import express from 'express';
import { getCustomers,getCustomer,createCustomer, deleteCustomerById } from '../controller/customer/customerController';

const router = express.Router();

// Định nghĩa các route cho Customers
router.get('/', getCustomers);
router.get('/:id',getCustomer);
router.post('/', createCustomer);
router.delete('/:id', deleteCustomerById);



export default router;