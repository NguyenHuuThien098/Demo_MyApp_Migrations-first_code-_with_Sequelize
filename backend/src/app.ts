import cors from 'cors';
import express from 'express';
import cookieParser from 'cookie-parser';
import productRoutes from './routes/productRoutes';
import shipperRoutes from './routes/shipperRoutes';
import customerRoutes from './routes/customerRoutes';
import orderRoutes from './routes/orderRoutes';
import orderDetailRoutes from './routes/orderDetailRoutes';
import authRoutes from './routes/authRoutes';
import adminRoutes from './routes/adminRoutes';
import customerProfileRoutes from './routes/customerProfileRoutes';
import db from './config/database';
import db_index from './models/index';
import dotenv from 'dotenv';
import { protect, authorizeRole } from './middleware/authMiddleware';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

const FRONTEND_PORT = process.env.FRONTEND_PORT || 3001; // Mặc định là 3001 nếu không có biến môi trường

const corsOptions = {
  origin: `http://localhost:${FRONTEND_PORT}`, // Linh động theo cổng frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], // Các phương thức HTTP được phép
  credentials: true, // Cho phép gửi cookie nếu cần
};
app.use(cors(corsOptions)); // Thêm middleware CORS

// Middleware
app.use(express.json());
app.use(cookieParser()); // Thêm middleware xử lý cookies

// Kết nối cơ sở dữ liệu
db.authenticate()
  .then(() => {
    console.log('Database connected successfully.');
  })
  .catch((err: any) => {
    console.error('Unable to connect to the database:', err);
  });

// Routes công khai - không cần xác thực
app.use('/api/auth', authRoutes);

// Routes cho quản trị viên
app.use('/api/admin', adminRoutes);

// Routes dành riêng cho khách hàng đã đăng nhập
app.use('/api/customer', customerProfileRoutes);

// Routes được bảo vệ - yêu cầu xác thực
app.use('/api/products', protect, productRoutes);
app.use('/api/shippers', protect, shipperRoutes);
app.use('/api/customers', protect, customerRoutes);
app.use('/api/orders', protect, orderRoutes);
app.use('/api/order-details', protect, orderDetailRoutes);

// Route kiểm tra trạng thái API
app.get('/api/status', (_, res) => {
  res.json({ status: 'API is running' });
});

// Route kiểm tra quyền admin
app.get('/admin/users', protect, authorizeRole(['admin']), async (_, res) => {
  try {
    const users = await db_index.User.findAll(); 
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Unable to fetch users' });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server is running on http://localhost:${PORT}`);
});