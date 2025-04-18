import cors from 'cors';
import express from 'express';
import productRoutes from './routes/productRoutes';
import shipperRoutes from './routes/shipperRoutes';
import customerRoutes from './routes/customerRoutes';
import orderRoutes from './routes/orderRoutes';
import orderDetailRoutes from './routes/orderDetailRoutes';
import db from './config/database';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;



const FRONTEND_PORT = process.env.FRONTEND_PORT || 3001; // Mặc định là 3001 nếu không có biến môi trường

const corsOptions = {
  origin: `http://localhost:${FRONTEND_PORT}`, // Linh động theo cổng frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Các phương thức HTTP được phép
  credentials: true, // Cho phép gửi cookie nếu cần
};
app.use(cors(corsOptions)); // Thêm middleware CORS

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
app.use('/products', productRoutes);
app.use('/shippers', shipperRoutes);
app.use('/customers', customerRoutes);
app.use('/orders', orderRoutes);
app.use('/order-details', orderDetailRoutes);

app.listen(PORT, () => {
  console.log(`Backend server is running on http://localhost:${PORT}`);
});