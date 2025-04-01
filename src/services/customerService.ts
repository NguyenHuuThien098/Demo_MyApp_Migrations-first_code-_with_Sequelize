import { fetchAllCustomers, fetchCustomerById } from '../repository/customerRepository';

export const fetchAllCustomersService = async () => {
  return await fetchAllCustomers();
};

export const fetchCustomerByIdService = async (id: number) => {
  return await fetchCustomerById(id); // Gọi repository để tìm customer theo ID
};