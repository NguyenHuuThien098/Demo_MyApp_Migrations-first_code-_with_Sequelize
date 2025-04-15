import { CustomerRepository } from '../repository/customerRepository';

export class CustomerService {
  private customerRepository: CustomerRepository;

  constructor() {
    this.customerRepository = new CustomerRepository();
  }

  public async fetchAllCustomers() {
    return await this.customerRepository.fetchAllCustomers(); // Lấy tất cả khách hàng
  }

  public async fetchCustomerById(id: number) {
    return await this.customerRepository.fetchCustomerById(id); // Tìm khách hàng theo ID
  }

  public async createCustomer(customerData: any) {
    return await this.customerRepository.createCustomer(customerData); // Tạo mới khách hàng
  }

  public async deleteCustomerById(id: number) {
    return await this.customerRepository.deleteCustomerById(id); // Xóa khách hàng theo ID
  }

  public async fetchTopCustomerByCountry(){
    return await this.customerRepository.fetchTopCustomerByCountry();
  }

  public async fetchCustomerTotalSpent(){
    return await this.customerRepository.fetchCustomerTotalSpent();
  }
}