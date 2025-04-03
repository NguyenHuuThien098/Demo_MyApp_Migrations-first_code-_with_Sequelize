import db from '../models';

const Customer = db.Customer;

export const fetchAllCustomers = async () => {
  return await Customer.findAll(); 
};

export const fetchCustomerById = async (id: number) => {
  return await Customer.findByPk(id); 
};

export const createCustomer = async (customerData: any) => {
  return await Customer.create(customerData); 
};

export const deleteCustomerById = async (id: number) => {
  return await Customer.destroy({ where: { id } }); 
};