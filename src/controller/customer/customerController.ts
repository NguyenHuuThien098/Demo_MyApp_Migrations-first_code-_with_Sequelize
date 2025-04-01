import { Request, Response } from 'express';
import { fetchAllCustomersService, fetchCustomerByIdService } from '../../services/customerService';

export const getCustomers = async (_: Request, res: Response): Promise<void> => {
  try {
    const customers = await fetchAllCustomersService();
    res.json(customers);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getCustomer = async (req: Request, res: Response): Promise<void> => {
  try {
    const customerId = Number(req.params.id); // Lấy ID từ params
    const customer = await fetchCustomerByIdService(customerId); // Gọi service để tìm customer
    if (!customer) {
      res.status(404).json({ error: 'Customer not found' }); // Nếu không tìm thấy
      return;
    }
    res.json(customer); // Trả về thông tin customer
  } catch (error: any) {
    res.status(500).json({ error: error.message }); // Xử lý lỗi
  }
};