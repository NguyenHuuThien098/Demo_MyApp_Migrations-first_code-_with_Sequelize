import { Request, Response } from 'express';
import { fetchAllCustomersService, fetchCustomerByIdService, createCustomerService, deleteCustomerByIdService} from '../../services/customerService';

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
    const customerId = Number(req.params.id);
    const customer = await fetchCustomerByIdService(customerId);
    if (!customer) {
      res.status(404).json({ error: 'Customer not found' }); 
      return;
    }
    res.json(customer); 
  } catch (error: any) {
    res.status(500).json({ error: error.message }); 
  }
};

export const createCustomer = async (req: Request, res: Response): Promise<void> => {
  try {
    const customer = await createCustomerService(req.body); 
    res.status(201).json(customer);
  } catch (error: any) {
    res.status(500).json({ error: error.message }); 
  }
};

export const deleteCustomerById = async (req: Request, res: Response): Promise<void> => {
  try {
    const customerId = Number(req.params.id);
    const deleted = await deleteCustomerByIdService(customerId); 

    if (!deleted) {
      res.status(404).json({ error: 'Customer not found' });
      return;
    }

    res.status(204).send(); 
  } catch (error: any) {
    res.status(500).json({ error: error.message }); 
  }
};