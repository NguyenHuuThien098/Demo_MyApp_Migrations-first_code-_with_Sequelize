import { fetchAllCustomers, fetchCustomerById, createCustomer, deleteCustomerById } from '../repository/customerRepository';

export const fetchAllCustomersService = async () => {
  return await fetchAllCustomers();
};

export const fetchCustomerByIdService = async (id: number) => {
  return await fetchCustomerById(id); // Gọi repository để tìm customer theo ID
};

export const createCustomerService = async (customerData: any) => {
  return await createCustomer(customerData); // Gọi repository để thêm mới customer
};

export const deleteCustomerByIdService = async (id: number) => {
  return await deleteCustomerById(id); // Gọi repository để xóa customer
};