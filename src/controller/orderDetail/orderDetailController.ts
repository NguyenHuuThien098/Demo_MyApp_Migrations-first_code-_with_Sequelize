import { Request, Response } from 'express';
import {
  getAllOrderDetailsService,
  getOrderDetailByIdService,
  createOrderDetailService,
  deleteOrderDetailByIdService,
  fetchOrderDetailsByOrderIdService,
} from '../../services/orderDetailService';

export const getOrderDetails = async (_: Request, res: Response): Promise<void> => {
  try {
    const orderDetails = await getAllOrderDetailsService();
    res.json(orderDetails);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getOrderDetailById = async (req: Request, res: Response): Promise<void> => {
  try {
    const orderDetail = await getOrderDetailByIdService(Number(req.params.id));
    if (!orderDetail) {
      res.status(404).json({ error: 'OrderDetail not found' });
      return;
    }
    res.json(orderDetail);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createOrderDetail = async (req: Request, res: Response): Promise<void> => {
  try {
    const orderDetail = await createOrderDetailService(req.body);
    res.status(201).json(orderDetail);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteOrderDetailById = async (req: Request, res: Response): Promise<void> => {
  try {
    const deleted = await deleteOrderDetailByIdService(Number(req.params.id));
    if (!deleted) {
      res.status(404).json({ error: 'OrderDetail not found' });
      return;
    }
    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getOrderDetailsByOrderId = async (req: Request, res: Response): Promise<void> => {
  try {
    const orderId = Number(req.params.orderId); // Lấy OrderId từ URL
    const orderDetails = await fetchOrderDetailsByOrderIdService(orderId); // Gọi service để lấy dữ liệu

    if (!orderDetails || orderDetails.length === 0) {
      res.status(404).json({ error: 'No order details found for the given OrderId' });
      return;
    }

    res.json(orderDetails); 
  } catch (error: any) {
    res.status(500).json({ error: error.message }); 
  }
};