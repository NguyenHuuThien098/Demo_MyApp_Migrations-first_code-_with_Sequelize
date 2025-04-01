import express from 'express';
import { getCustomers, getCustomer } from './controller/customer/customerController';
import { getShippers } from './controller/shipper/shipperController';
import { getProducts } from './controller/product/productController';
import db from './config/database';

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(express.json());

// Kết nối cơ sở dữ liệu
db.authenticate()
  .then(() => {
    console.log('Database connected successfully.');
  })
  .catch((err: any) => {
    console.error('Unable to connect to the database:', err);
  });

// Routes
app.get('/customers', getCustomers); // Lấy danh sách khách hàng
app.get('/customers/:id', getCustomer); // Lấy thông tin khách hàng theo ID
app.get('/shippers', getShippers); // Lấy danh sách Shippers
app.get('/products', getProducts); // Lấy danh sách Products

// Khởi động server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});