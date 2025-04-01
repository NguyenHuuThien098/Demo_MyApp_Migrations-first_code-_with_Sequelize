import db from '../models';

const Customer = db.Customer;

export const fetchAllCustomers = async () => {
  return await Customer.findAll(); // Lấy tất cả khách hàng
};

export const fetchCustomerById = async (id: number) => {
  return await Customer.findByPk(id); // Tìm khách hàng theo ID
};