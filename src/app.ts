import express from 'express';
import db from './models'; // Import models để kết nối cơ sở dữ liệu

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(express.json());

// Kết nối cơ sở dữ liệu
db.sequelize
  .authenticate()
  .then(() => {
    console.log('Database connected successfully.');
  })
  .catch((err: any) => {
    console.error('Unable to connect to the database:', err);
  });

// API: Lấy danh sách khách hàng
app.get('/customers', async (_, res) => {
  try {
    const customers = await db.Customer.findAll();
    res.json(customers);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// API: Lấy danh sách sản phẩm
app.get('/products', async (_, res) => {
  try {
    const products = await db.Product.findAll();
    res.json(products);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Khởi động server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});