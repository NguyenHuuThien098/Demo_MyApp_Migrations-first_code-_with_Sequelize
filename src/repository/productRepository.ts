import { QueryTypes } from 'sequelize';
import db from '../models';

const sequelize = db.sequelize;

const Product = db.Product;

export const fetchAllProducts = async () => {
  return await Product.findAll(); 
};

export const fetchProductById = async (id: number) => {
  return await Product.findByPk(id);
};

export const createProduct = async (productData: any) => {
  return await Product.create(productData);
};

export const deleteProductById = async (id: number) => {
  return await Product.destroy({ where: { id } });
};

export const updateProductById = async (id: number, productData: any) => {
  return await Product.update(productData, { where: { id }, returning: true });
};

export const fetchTopProductsInQ1 = async () => {
  const query = `
    SELECT 
        Products.Name AS ProductName, 
        SUM(OrderDetails.Quantity * OrderDetails.Price) AS TotalSales
    FROM Products
    JOIN OrderDetails ON Products.id = OrderDetails.ProductId
    JOIN Orders ON OrderDetails.OrderId = Orders.id
    WHERE MONTH(Orders.OrderDate) BETWEEN 3 AND 4 -- Quý đầu tiên của năm
    GROUP BY Products.Name
    ORDER BY TotalSales DESC;
  `;

  return await sequelize.query(query, { type: QueryTypes.SELECT });
};

export const fetchTopProductsByQuarter = async (startMonth: number, endMonth: number) => {
  const query = `
    SELECT 
        Products.Name AS ProductName, 
        SUM(OrderDetails.Quantity * OrderDetails.Price) AS TotalSales
    FROM Products
    JOIN OrderDetails ON Products.id = OrderDetails.ProductId
    JOIN Orders ON OrderDetails.OrderId = Orders.id
    WHERE MONTH(Orders.OrderDate) BETWEEN :startMonth AND :endMonth -- Lọc theo khoảng thời gian của quý
    GROUP BY Products.Name
    ORDER BY TotalSales DESC;
  `;

  return await sequelize.query(query, {
    type: QueryTypes.SELECT,
    replacements: { startMonth, endMonth }, // Truyền tham số vào truy vấn
  });
};