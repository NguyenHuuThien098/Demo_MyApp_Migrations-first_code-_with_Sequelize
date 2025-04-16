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

  public async fetchDaysWithoutOrdersForMonth(year: number, month: number) {
    const query = `
      WITH RECURSIVE AllDates AS (
          SELECT 
              DATE(CONCAT(:inputYear, '-', :inputMonth, '-01')) AS OrderDate
          UNION ALL
          SELECT 
              DATE_ADD(OrderDate, INTERVAL 1 DAY)
          FROM 
              AllDates
          WHERE 
              OrderDate < LAST_DAY(DATE(CONCAT(:inputYear, '-', :inputMonth, '-01')))
      ),
      NoOrders AS (
          SELECT 
              a.OrderDate,
              MONTH(a.OrderDate) AS Month,
              YEAR(a.OrderDate) AS Year
          FROM 
              AllDates a
          LEFT JOIN 
              Orders o ON a.OrderDate = DATE(o.OrderDate)
          WHERE 
              o.id IS NULL
      )
      SELECT 
          OrderDate,
          Month,
          Year
      FROM 
          NoOrders;
    `;

    return await sequelize.query(query, {
      type: QueryTypes.SELECT,
      replacements: { inputYear: year, inputMonth: month },
    });
  }
  
  public async fetchSecondHighestOrderDaysPerMonth() {
    const query = `
      SELECT OrderDate, COUNT(orders.id) AS OrderCount
      FROM Orders
      GROUP BY OrderDate
      HAVING COUNT(*) = (
          SELECT COUNT(*)
          FROM Orders AS O
          WHERE MONTH(O.OrderDate) = MONTH(Orders.OrderDate)
          GROUP BY O.OrderDate
          ORDER BY COUNT(*) DESC
          LIMIT 1 OFFSET 1
      );
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

  public async fetchOrderDetails() {
    const query = `
      SELECT  customers.Name AS CustomerName, shippers.Name AS ShipperName, 
              SUM(OrderDetails.Quantity * OrderDetails.Price) AS TotalAmount
      FROM orders
      JOIN customers ON customers.id = orders.CustomerId
      JOIN shippers ON shippers.id = orders.ShipperId
      JOIN orderdetails ON orderdetails.OrderId = orders.id
      GROUP BY Orders.Id, Customers.Name, Shippers.Name
      ORDER BY CustomerName ASC;
    `;
    return await sequelize.query(query, { type: QueryTypes.SELECT });
  }

  public async fetchTotalAmountByCountry() {

    const query = `
    SELECT customers.Country, SUM(OrderDetails.Quantity * OrderDetails.Price) AS TotalAmount
    FROM orderdetails
    JOIN orders ON orderdetails.OrderId = orders.Id
    JOIN customers ON orders.CustomerId = customers.Id
    GROUP BY customers.Country
    ORDER BY TotalAmount DESC;
    `;

    return await sequelize.query(query, { type: QueryTypes.SELECT });
  }

  public async fetchOrdersWithTotalAmountGreaterThan1000() {

    const query = `
    
    SELECT 	orders.id, 
            CONCAT(customers.Name, ' - ID: ', orders.CustomerID) AS CustomerInfo,  
            CONCAT(shippers.Name, ' - ID: ',orders.ShipperId) AS ShipperInfo,
            SUM(orderdetails.Quantity * orderdetails.Price) AS TotalAmount, orders.OrderDate
    FROM orderdetails
    JOIN orders ON orderdetails.OrderId = orders.id
    JOIN customers ON orders.CustomerId = customers.id
    JOIN shippers ON orders.ShipperID = shippers.id
    GROUP BY OrderId
    HAVING SUM(orderdetails.Quantity * orderdetails.Price)>1000
    ORDER BY TotalAmount DESC;
    `;

    return await sequelize.query(query, { type: QueryTypes.SELECT });
  }

  public async fetchOrdersAboveAverage() {

    const query = `
    SELECT 	Orders.id AS OrderID, 
            CONCAT(customers.Name ,' - ID: ',customers.id ) AS CustomerInfo,
            CONCAT(shippers.Name, ' - ID: ', shippers.id) As ShipperInfo,
            SUM(OrderDetails.Quantity * OrderDetails.Price) AS TotalAmount,
            orders.OrderDate
    FROM Orders
    JOIN OrderDetails ON Orders.Id = OrderDetails.OrderId
    JOIN customers ON orders.CustomerId = customers.id
    JOIN shippers ON orders.ShipperId = shippers.id
    GROUP BY Orders.Id
    HAVING SUM(OrderDetails.Quantity * OrderDetails.Price) > (
        SELECT AVG(TotalAmount)
        FROM (
            SELECT SUM(OrderDetails.Quantity * OrderDetails.Price) AS TotalAmount
            FROM Orders
            JOIN OrderDetails ON Orders.Id = OrderDetails.OrderId
            GROUP BY Orders.Id
        ) AS AvgAmount
    );
    `;

    return await sequelize.query(query, { type: QueryTypes.SELECT });
  }
}