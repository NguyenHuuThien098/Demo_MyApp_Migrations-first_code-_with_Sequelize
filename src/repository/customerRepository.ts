import db from '../models';
import { QueryTypes } from 'sequelize';

const Customer = db.Customer;
const sequelize = db.sequelize;

export class CustomerRepository {
  public async fetchAllCustomers() {
    return await Customer.findAll(); // Lấy tất cả khách hàng
  }

  public async fetchCustomerById(id: number) {
    return await Customer.findByPk(id); // Tìm khách hàng theo ID
  }

  public async createCustomer(customerData: any) {
    return await Customer.create(customerData); // Tạo mới khách hàng
  }

  public async deleteCustomerById(id: number) {
    return await Customer.destroy({ where: { id } }); // Xóa khách hàng theo ID
  }

  public async fetchTopCustomerByCountry() {
    const query = `
      SELECT  customers.Country, customers.Name AS CustomerName, 
              SUM(orderdetails.Quantity * orderdetails.Price) AS TotalSpent
      FROM orderdetails
      JOIN orders ON orderdetails.OrderId = orders.Id
      JOIN customers ON orders.CustomerId = customers.Id
      GROUP BY customers.Country, customers.Name
      HAVING SUM(orderdetails.Quantity * orderdetails.Price) = (
          SELECT MAX(TotalSpent)
          FROM (
              SELECT  customers.Country,customers.Name, 
                      SUM(orderdetails.Quantity * orderdetails.Price) AS TotalSpent
              FROM orderDetails
              JOIN orders ON orderDetails.OrderId = orders.Id
              JOIN customers ON orders.CustomerId = customers.Id
              GROUP BY Customers.Name, customers.Country
          ) AS CountryMax
          WHERE CountryMax.Country = customers.Country
      )
      ORDER BY TotalSpent DESC;
    `;
    return await sequelize.query(query, { type: QueryTypes.SELECT });
  }

  public async fetchCustomerTotalSpent() {
    const query = `
      SELECT Customers.Name AS CustomerName, SUM(OrderDetails.Quantity * OrderDetails.Price) AS TotalSpent
      FROM OrderDetails
      JOIN Orders ON OrderDetails.OrderId = Orders.Id
      JOIN Customers ON Orders.CustomerId = Customers.Id
      GROUP BY Customers.Name
      ORDER BY CustomerName ASC;
    `;
    return await sequelize.query(query, { type: QueryTypes.SELECT });
  }

  public async fetchCustomersWithThreeMonthsNoOrders() {
    const query = `
        SELECT customers.Name, customers.id
        FROM Customers
        WHERE NOT EXISTS (
            SELECT 1
            FROM Orders
            WHERE Orders.CustomerId = Customers.Id
            AND (MONTH(Orders.OrderDate) BETWEEN 1 AND 3)
        );
      `;

    return await sequelize.query(query, { type: QueryTypes.SELECT });
  }

  public async fetchCustomerTotalSaleRankingsByYear() {
    const query = `
    WITH CustomerSales AS (
        SELECT 
            Customers.Name AS customerName,
            YEAR(Orders.OrderDate) AS Year,
            SUM(OrderDetails.Quantity * OrderDetails.Price) AS totalSales
        FROM 
            Orders
        JOIN 
            Customers ON Orders.CustomerId = Customers.Id
        JOIN 
            OrderDetails ON Orders.Id = OrderDetails.OrderId
        GROUP BY 
            Customers.Name, YEAR(Orders.OrderDate)
    )
    SELECT 
        Year,
        JSON_ARRAYAGG(
            JSON_OBJECT(
                'Name', customerName,
                'totalSales', CAST(totalSales AS CHAR)
            )
        ) AS Customers
    FROM 
        CustomerSales
    GROUP BY 
        Year
    ORDER BY 
        Year DESC;
    `;

    // const newquery = `
    // SELECT Customers.Name, YEAR(Orders.OrderDate) AS Year, SUM(OrderDetails.Quantity * OrderDetails.Price) AS totalSales
    // FROM Orders
    // JOIN Customers ON Orders.CustomerId = Customers.Id
    // JOIN OrderDetails ON Orders.Id = OrderDetails.OrderId
    // GROUP BY Customers.Name, YEAR(Orders.OrderDate)
    // ORDER BY Year DESC, totalSales DESC;
    // `;

    return await sequelize.query(query, { type: QueryTypes.SELECT });
  }
}