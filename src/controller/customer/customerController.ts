import { Request, Response } from 'express';
import { CustomerService } from '../../services/customerService';

export class CustomerController {
  private customerService: CustomerService;

  constructor() {
    this.customerService = new CustomerService();
  }

  public async getCustomers(_: Request, res: Response): Promise<void> {
    try {
      const customers = await this.customerService.fetchAllCustomers();
      res.json(customers);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  public async getCustomer(req: Request, res: Response): Promise<void> {
    try {
      const customerId = Number(req.params.id);
      if (isNaN(customerId)) {
        res.status(400).json({ error: 'Invalid customer ID' });
        return;
      }

      const customer = await this.customerService.fetchCustomerById(customerId);
      if (!customer) {
        res.status(404).json({ error: 'Customer not found' });
        return;
      }

      res.json(customer);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  public async createCustomer(req: Request, res: Response): Promise<void> {
    try {
      const customer = await this.customerService.createCustomer(req.body);
      res.status(201).json(customer);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  public async deleteCustomerById(req: Request, res: Response): Promise<void> {
    try {
      const customerId = Number(req.params.id);
      if (isNaN(customerId)) {
        res.status(400).json({ error: 'Invalid customer ID' });
        return;
      }

      const deleted = await this.customerService.deleteCustomerById(customerId);
      if (!deleted) {
        res.status(404).json({ error: 'Customer not found' });
        return;
      }

      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}