// import express from 'express';
// import { getCustomers,getCustomer,createCustomer, deleteCustomerById } from '../controller/customer/customerController';

// const router = express.Router();

// // Định nghĩa các route cho Customers
// //TĨNH
// router.get('/', getCustomers);

// //ĐỘNG
// router.get('/:id',getCustomer);

// //CRUD
// router.post('/', createCustomer);
// router.delete('/:id', deleteCustomerById);

// export default router;


import express from 'express';
import { CustomerController } from '../controller/customer/customerController';

const router = express.Router();
const customerController = new CustomerController();

// Định nghĩa các route cho Customers
router.get('/', customerController.getCustomers.bind(customerController)); // Lấy tất cả khách hàng
router.get('/:id', customerController.getCustomer.bind(customerController)); // Lấy khách hàng theo ID
router.post('/', customerController.createCustomer.bind(customerController)); // Tạo mới khách hàng
router.delete('/:id', customerController.deleteCustomerById.bind(customerController)); // Xóa khách hàng theo ID

export default router;