import express from 'express';
import productRoutes from './routes/productRoutes';
import shipperRoutes from './routes/shipperRoutes';
import customerRoutes from './routes/customerRoutes';
import orderRoutes from './routes/orderRoutes';
import orderDetailRoutes from './routes/orderDetailRoutes';
import db from './config/database';


const app = express();
const PORT = process.env.PORT;

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
app.use('/products',productRoutes);
app.use('/shippers',shipperRoutes);
app.use('/customers', customerRoutes);
app.use('/orders', orderRoutes);
app.use('/orderdetails', orderDetailRoutes);

// Khởi động server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});