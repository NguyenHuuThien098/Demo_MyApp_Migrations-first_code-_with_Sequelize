import db from '../models';
import { QueryTypes } from 'sequelize';

const sequelize = db.sequelize;
const Order = db.Order;

export class OrderRepository {
  public async fetchAllOrders() {
    return await Order.findAll({
      include: [
        { model: db.Customer },
        { model: db.Shipper },
        { model: db.OrderDetail },
      ],
    });
  }

  public async fetchOrderById(id: number) {
    return await Order.findByPk(id, {
      include: [
        { model: db.Customer },
        { model: db.Shipper },
        { model: db.OrderDetail },
      ],
    });
  }

  public async createOrder(orderData: any) {
    return await Order.create(orderData);
  }

  public async deleteOrderById(id: number) {
    return await Order.destroy({ where: { id } });
  }

  public async fetchOrdersByCustomerId(customerId: number) {
    return await Order.findAll({
      where: { CustomerId: customerId },
      include: [
        { model: db.Customer, attributes: ['id', 'name', 'contactName', 'country'] },
        { model: db.Shipper, attributes: ['id', 'Name', 'shipper_code'] },
        { model: db.OrderDetail, include: [{ model: db.Product, attributes: ['id', 'Name', 'UnitPrice'] }] },
      ],
    });
  }

  public async fetchOrdersWithCustomerInfo() {
    const query = `
      SELECT 
        o.id AS orderId,
        o.OrderDate AS orderDate,
        c.id AS customerId,
        c.name AS customerName,
        c.contactName AS customerContactName,
        c.country AS customerCountry,
        od.id AS orderDetailId,
        od.ProductId AS productId,
        od.Quantity AS quantity,
        od.Price AS price,
        p.Name AS productName,
        p.UnitPrice AS productUnitPrice
      FROM 
        Orders o
      INNER JOIN 
        Customers c ON o.CustomerId = c.id
      INNER JOIN 
        OrderDetails od ON o.id = od.OrderId
      INNER JOIN 
        Products p ON od.ProductId = p.id;
    `;
    return await sequelize.query(query, { type: QueryTypes.SELECT });
  }

  public async fetchDaysWithoutOrders() {
    const query = `
      WITH RECURSIVE calendar AS (
        SELECT DATE_FORMAT(CURDATE(), '%Y-%m-01') AS date
        UNION ALL
        SELECT DATE_ADD(date, INTERVAL 1 DAY)
        FROM calendar
        WHERE date < LAST_DAY(CURDATE())
      )
      SELECT date
      FROM calendar
      WHERE date NOT IN (
        SELECT DATE(OrderDate)
        FROM Orders
      );
    `;
    return await sequelize.query(query, { type: QueryTypes.SELECT });
  }

  public async fetchSecondHighestOrderDaysPerMonth() {
    const query = `
      WITH monthly_order_counts AS (
          SELECT 
              DATE(OrderDate) AS orderDate,
              MONTH(OrderDate) AS month,
              YEAR(OrderDate) AS year,
              COUNT(*) AS orderCount
          FROM Orders
          GROUP BY DATE(OrderDate), MONTH(OrderDate), YEAR(OrderDate)
      ),
      ranked_orders AS (
          SELECT 
              orderDate,
              month,
              year,
              orderCount,
              RANK() OVER (PARTITION BY year, month ORDER BY orderCount DESC) AS \`rank\`
          FROM monthly_order_counts
      )
      SELECT 
          orderDate,
          month,
          year,
          orderCount
      FROM ranked_orders
      WHERE \`rank\` = 2
      ORDER BY year, month;
    `;
    return await sequelize.query(query, { type: QueryTypes.SELECT });
  }

  public async fetchCustomerRankingByYear() {
    const query = `
      SELECT Customers.Name, YEAR(Orders.OrderDate) AS Year, SUM(OrderDetails.Quantity * OrderDetails.Price) AS totalSales
      FROM Orders
      JOIN Customers ON Orders.CustomerId = Customers.Id
      JOIN OrderDetails ON Orders.Id = OrderDetails.OrderId
      GROUP BY Customers.Name, YEAR(Orders.OrderDate)
      ORDER BY Year DESC, totalSales DESC;
    `;
    return await sequelize.query(query, { type: QueryTypes.SELECT });
  }
}