import { Request, Response } from 'express';
import { OrderDetailService } from '../../services/orderDetailService';

export class OrderDetailController {
  private orderDetailService: OrderDetailService;

  constructor() {
    this.orderDetailService = new OrderDetailService();
  }

  public async getOrderDetails(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      let pageSize = parseInt(req.query.pageSize as string) || 10;

      if (pageSize > 10) {
        pageSize = 10;
      }

      const searchText = req.query.searchText as string || null;
      const order = req.query.order as string || 'asc';

      if (order !== 'asc' && order !== 'desc') {
        res.status(400).json({ error: "Invalid order value. Use 'asc' or 'desc'." });
        return;
      }

      const result = await this.orderDetailService.fetchAllOrderDetails(page, pageSize, searchText, order);

      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  public async getOrderDetailById(req: Request, res: Response): Promise<void> {
    try {
      const orderDetail = await this.orderDetailService.fetchOrderDetailById(Number(req.params.id));
      if (!orderDetail) {
        res.status(404).json({ error: 'OrderDetail not found' });
        return;
      }
      res.json(orderDetail);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  public async createOrderDetail(req: Request, res: Response): Promise<void> {
    try {
      const orderDetail = await this.orderDetailService.createOrderDetail(req.body);
      res.status(201).json(orderDetail);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  public async deleteOrderDetailById(req: Request, res: Response): Promise<void> {
    try {
      const deleted = await this.orderDetailService.deleteOrderDetailById(Number(req.params.id));
      if (!deleted) {
        res.status(404).json({ error: 'OrderDetail not found' });
        return;
      }
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  public async getOrderDetailsByOrderId(req: Request, res: Response): Promise<void> {
    try {
      const orderId = Number(req.params.orderId);
      const orderDetails = await this.orderDetailService.fetchOrderDetailsByOrderId(orderId);

      if (!orderDetails || orderDetails.length === 0) {
        res.status(404).json({ error: 'No order details found for the given OrderId' });
        return;
      }

      res.json(orderDetails);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}