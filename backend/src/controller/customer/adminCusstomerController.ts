import { Request, Response } from 'express';
import { adminService } from '../../services/adminService';

export class AdminCustomerController {
  /**
   * Lấy danh sách tất cả khách hàng
   * @route GET /admin/customers
   */
  public async getAllCustomers(_: Request, res: Response): Promise<void> {
    try {
      const customers = await adminService.getAllCustomers();
      res.json(customers);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Lấy thông tin chi tiết của một khách hàng
   * @route GET /admin/customers/:id
   */
  public async getCustomerById(req: Request, res: Response): Promise<void> {
    try {
      const customerId = Number(req.params.id);
      if (isNaN(customerId)) {
        res.status(400).json({ error: 'Invalid customer ID' });
        return;
      }

      const customer = await adminService.getUserById(customerId);
      if (!customer) {
        res.status(404).json({ error: 'Customer not found' });
        return;
      }

      res.json(customer);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Lấy danh sách khách hàng không đặt hàng trong 3 tháng
   * @route GET /admin/customers/no-orders
   */
  // public async getCustomersWithThreeMonthsNoOrders(_: Request, res: Response): Promise<void> {
  //   try {
  //     const customers = await adminService.getCustomersWithThreeMonthsNoOrders();
  //     res.json(customers);
  //   } catch (error: any) {
  //     res.status(500).json({ error: error.message });
  //   }
  // }

  /**
   * Lấy danh sách khách hàng hàng đầu theo quốc gia
   * @route GET /admin/customers/top-by-country
   */
  public async getTopCustomerByCountry(_: Request, res: Response): Promise<void> {
    try {
      const topCustomers = await adminService.getAllCustomers(); // Thay đổi logic nếu cần
      res.json(topCustomers);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Lấy tổng số tiền mà khách hàng đã chi tiêu
   * @route GET /admin/customers/total-spent
   */
  // public async getCustomerTotalSpent(_: Request, res: Response): Promise<void> {
  //   try {
  //     const customerTotalSpent = await adminService.getCustomerTotalSpent(); // Thay đổi logic nếu cần
  //     res.json(customerTotalSpent);
  //   } catch (error: any) {
  //     res.status(500).json({ error: error.message });
  //   }
  // }
}

// Export singleton instance
export const adminCustomerController = new AdminCustomerController();