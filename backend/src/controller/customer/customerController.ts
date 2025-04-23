import { Request, Response } from 'express';
import { CustomerService } from '../../services/customerService';

export class CustomerController {
  private customerService: CustomerService;

  constructor() {
    this.customerService = new CustomerService();
  }

  /**
   * Search customers with pagination and filters
   */
  public async searchCustomers(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      let pageSize = parseInt(req.query.pageSize as string) || 10;

      if (pageSize > 50) {
        pageSize = 50;
      }

      const searchText = req.query.searchText as string || '';
      
      // Extract filter parameters
      const filters: any = {};
      
      // Country filter
      if (req.query.country) {
        filters.country = req.query.country as string;
      }
      
      // User association filter
      if (req.query.hasUser === 'true') {
        filters.hasUser = true;
        filters.includeUser = true;
      } else if (req.query.hasUser === 'false') {
        filters.hasUser = false;
      }
      
      // Include user details if requested
      if (req.query.includeUser === 'true') {
        filters.includeUser = true;
      }
      
      // Sorting
      if (req.query.orderBy) {
        filters.orderBy = req.query.orderBy as string;
      }
      
      if (req.query.orderDirection && ['ASC', 'DESC'].includes((req.query.orderDirection as string).toUpperCase())) {
        filters.orderDirection = (req.query.orderDirection as string).toUpperCase();
      }

      const result = await this.customerService.searchCustomers(page, pageSize, searchText, filters);
      
      res.status(200).json({ 
        success: true, 
        ...result 
      });
    } catch (error: any) {
      res.status(500).json({ 
        success: false, 
        message: error.message 
      });
    }
  }
}