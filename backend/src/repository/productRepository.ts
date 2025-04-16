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
    return await Product.findAll({
      attributes: [['Name', 'productName']], // Lấy tên sản phẩm và đặt alias là productName
      where: {
        id: {
          [db.Sequelize.Op.notIn]: db.sequelize.literal(`
            (SELECT DISTINCT OrderDetails.ProductId
             FROM OrderDetails)
          `), // Lọc các sản phẩm không có trong bảng OrderDetails
        },
      },
      raw: true,
    });
  }

}