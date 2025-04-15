import express from 'express';
import { getCustomers,getCustomer,createCustomer, deleteCustomerById } from '../controller/customer/customerController';

const router = express.Router();

// Định nghĩa các route cho Customers
//TĨNH
router.get('/', getCustomers);

//ĐỘNG
router.get('/:id',getCustomer);

//CRUD
router.post('/', createCustomer);
router.delete('/:id', deleteCustomerById);



export default router;