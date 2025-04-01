import express from 'express';
import connectDatabase from './config/database';
import db from './models';

const Customer = db.Customer;
const Product = db.Product;


const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(express.json());

// Kết nối cơ sở dữ liệu
connectDatabase();

// API: Lấy danh sách khách hàng
app.get('/customers', async (_, res) => {
  try {
    const customers = await Customer.findAll();
    res.json(customers);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// API: Lấy danh sách sản phẩm
app.get('/products', async (_, res) => {
  try {
    const products = await Product.findAll();
    res.json(products);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// API: Tạo khách hàng mới
app.post('/customers', async (req, res) => {
  try {
    const customer = await Customer.create(req.body);
    res.status(201).json(customer);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Khởi động server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});