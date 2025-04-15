import { QueryTypes } from 'sequelize';
import db from '../models';

const sequelize = db.sequelize;
const Product = db.Product;

export class ProductRepository {
  public async fetchAllProducts() {
    return await Product.findAll();
  }

  public async fetchProductById(id: number) {
    return await Product.findByPk(id);
  }

  public async createProduct(productData: any) {
    return await Product.create(productData);
  }

  public async deleteProductById(id: number) {
    return await Product.destroy({ where: { id } });
  }

  public async updateProductById(id: number, productData: any) {
    return await Product.update(productData, { where: { id }, returning: true });
  }

  public async fetchTopProductsInQ1() {
    const query = `
      SELECT 
          Products.Name AS ProductName, 
          SUM(OrderDetails.Quantity * OrderDetails.Price) AS TotalSales
      FROM Products
      JOIN OrderDetails ON Products.id = OrderDetails.ProductId
      JOIN Orders ON OrderDetails.OrderId = Orders.id
      WHERE MONTH(Orders.OrderDate) BETWEEN 1 AND 3
      GROUP BY Products.Name
      ORDER BY TotalSales DESC;
    `;
    return await sequelize.query(query, { type: QueryTypes.SELECT });
  }

  public async fetchTopProductsByQuarter(startMonth: number, endMonth: number) {
    const query = `
      SELECT 
          Products.Name AS ProductName, 
          SUM(OrderDetails.Quantity * OrderDetails.Price) AS TotalSales
      FROM Products
      JOIN OrderDetails ON Products.id = OrderDetails.ProductId
      JOIN Orders ON OrderDetails.OrderId = Orders.id
      WHERE MONTH(Orders.OrderDate) BETWEEN :startMonth AND :endMonth
      GROUP BY Products.Name
      ORDER BY TotalSales DESC;
    `;
    return await sequelize.query(query, {
      type: QueryTypes.SELECT,
      replacements: { startMonth, endMonth },
    });
  }

  public async fetchProductsNeverOrdered() {
    const query = `
      SELECT products.Name AS productName
      FROM products
      WHERE products.id NOT IN (
        SELECT DISTINCT OrderDetails.ProductId
        FROM OrderDetails
      );
    `;
    return await sequelize.query(query, { type: QueryTypes.SELECT });
  }

}