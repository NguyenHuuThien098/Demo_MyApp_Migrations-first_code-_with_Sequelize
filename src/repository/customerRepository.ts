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

  public async fetchTopCustomerByCountry(){
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
}