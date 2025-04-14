import db from '../models';
import { QueryTypes } from 'sequelize';

const sequelize = db.sequelize;


const Order = db.Order;

export const fetchAllOrders = async () => {
  // Lấy tất cả các đơn hàng, bao gồm thông tin khách hàng, shipper và chi tiết đơn hàng
  return await Order.findAll({
    include: [
      { model: db.Customer },
      { model: db.Shipper },
      { model: db.OrderDetail },
    ],
  });
};

export const fetchOrderById = async (id: number) => {
  // Lấy thông tin đơn hàng theo ID, bao gồm thông tin khách hàng, shipper và chi tiết đơn hàng
  return await Order.findByPk(id, {
    include: [
      { model: db.Customer },
      { model: db.Shipper },
      { model: db.OrderDetail },
    ],
  });
};

export const createOrder = async (orderData: any) => {
  // Tạo một đơn hàng mới với dữ liệu được cung cấp
  return await Order.create(orderData);
};

export const deleteOrderById = async (id: number) => {
  // Xóa một đơn hàng theo ID
  return await Order.destroy({ where: { id } });
};

export const fetchOrdersByCustomerId = async (customerId: number) => {
  // Lấy tất cả các đơn hàng của một khách hàng dựa trên CustomerId
  if (isNaN(customerId)) {
    throw new Error('Invalid CustomerId. It must be a number.');
  }

  return await Order.findAll({
    where: { CustomerId: customerId },
    include: [
      { model: db.Customer, attributes: ['id', 'name', 'contactName', 'country'] },
      { model: db.Shipper, attributes: ['id', 'Name', 'shipper_code'] },
      { model: db.OrderDetail, include: [{ model: db.Product, attributes: ['id', 'Name', 'UnitPrice'] }] },
    ],
  });
};

export const fetchOrdersWithCustomerInfo = async () => {
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
};

export const fetchDaysWithoutOrders = async () => {
  const query = `
    WITH RECURSIVE calendar AS (
      SELECT DATE_FORMAT(CURDATE(), '%Y-%m-01') AS date -- Ngày đầu tiên của tháng hiện tại
      UNION ALL
      SELECT DATE_ADD(date, INTERVAL 1 DAY)
      FROM calendar
      WHERE date < LAST_DAY(CURDATE()) -- Ngày cuối cùng của tháng hiện tại
    )
    SELECT date
    FROM calendar
    WHERE date NOT IN (
      SELECT DATE(OrderDate)
      FROM Orders
    );
  `;

  return await sequelize.query(query, { type: QueryTypes.SELECT });
};

export const fetchSecondHighestOrderDaysPerMonth = async () => {
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
    WHERE \`rank\` = 2 -- Đặt từ khóa rank trong dấu ngoặc kép
    ORDER BY year, month;
  `;

  return await sequelize.query(query, { type: QueryTypes.SELECT });
};


export const fetchCustomerRankingByYear = async () => {
  console.log("===================================")
  const query = `
    SELECT Customers.Name, YEAR(Orders.OrderDate) AS Year, SUM(OrderDetails.Quantity * OrderDetails.Price) AS totalSales
    FROM Orders
    JOIN Customers ON Orders.CustomerId = Customers.Id
    JOIN OrderDetails ON Orders.Id = OrderDetails.OrderId
    GROUP BY Customers.Name, YEAR(Orders.OrderDate)
    ORDER BY Year DESC, totalSales DESC;
  `;
  console.log(query);
  return await sequelize.query(query, { type: QueryTypes.SELECT });
};