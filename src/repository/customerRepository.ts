import db from '../models';

const Customer = db.Customer;

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
}