import { Request, Response } from 'express';
import {
  getAllOrderDetailsService,
  getOrderDetailByIdService,
  createOrderDetailService,
  deleteOrderDetailByIdService,
  fetchOrderDetailsByOrderIdService,
} from '../../services/orderDetailService';

export const getOrderDetails = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1; // Trang hiện tại (mặc định là 1)
    let pageSize = parseInt(req.query.pageSize as string) || 10; // Số lượng bản ghi mỗi trang (mặc định là 10)

    // Giới hạn pageSize không vượt quá 10
    if (pageSize > 10) {
      pageSize = 10;
    }

    const searchText = req.query.searchText as string || null; // Text tìm kiếm (mặc định là null)
    const order = req.query.order as string || 'asc'; // Sắp xếp (mặc định là 'asc')

    // Validate order by
    if (order !== 'asc' && order !== 'desc') {
      res.status(400).json({ error: "Invalid order value. Use 'asc' or 'desc'." });
      return;
    }

    const result = await getAllOrderDetailsService(page, pageSize, searchText, order);

    res.json(result); // Trả về dữ liệu phân trang
  } catch (error: any) {
    console.error('Error fetching order details:', error);
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

    res.json(orderDetails); // Trả về danh sách OrderDetails
  } catch (error: any) {
    res.status(500).json({ error: error.message }); // Xử lý lỗi
  }
};