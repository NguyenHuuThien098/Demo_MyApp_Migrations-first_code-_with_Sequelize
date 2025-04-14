import { Request, Response } from 'express';
import {
    getAllOrdersService,
    getOrderByIdService,
    createOrderService,
    deleteOrderByIdService,
    getOrdersByCustomerIdService,
    getOrdersWithCustomerInfoService,
    getDaysWithoutOrdersService,
    getSecondHighestOrderDaysPerMonthService,
    getCustomerRankingByYearService,
} from '../../services/orderService';

// Lấy tất cả các đơn hàng
export const getOrders = async (_: Request, res: Response): Promise<void> => {
    try {
        const orders = await getAllOrdersService(); // Gọi service để lấy tất cả đơn hàng
        res.json(orders); // Trả về danh sách đơn hàng
    } catch (error: any) {
        res.status(500).json({ error: error.message }); // Xử lý lỗi
    }
};

// Lấy thông tin đơn hàng theo ID
export const getOrderById = async (req: Request, res: Response): Promise<void> => {
    try {
        const order = await getOrderByIdService(Number(req.params.id)); // Gọi service để lấy đơn hàng theo ID
        if (!order) {
            res.status(404).json({ error: 'Order not found' }); // Trả về lỗi nếu không tìm thấy đơn hàng
            return;
        }
        res.json(order); // Trả về thông tin đơn hàng
    } catch (error: any) {
        res.status(500).json({ error: error.message }); // Xử lý lỗi
    }
};

// Tạo đơn hàng mới
export const createOrder = async (req: Request, res: Response): Promise<void> => {
    try {
        const order = await createOrderService(req.body); // Gọi service để tạo đơn hàng mới
        res.status(201).json(order); // Trả về thông tin đơn hàng vừa tạo
    } catch (error: any) {
        res.status(500).json({ error: error.message }); // Xử lý lỗi
    }
};

// Xóa đơn hàng theo ID
export const deleteOrderById = async (req: Request, res: Response): Promise<void> => {
    try {
        const deleted = await deleteOrderByIdService(Number(req.params.id)); // Gọi service để xóa đơn hàng theo ID
        if (!deleted) {
            res.status(404).json({ error: 'Order not found' }); // Trả về lỗi nếu không tìm thấy đơn hàng
            return;
        }
        res.status(204).send(); // Trả về trạng thái thành công nhưng không có nội dung
    } catch (error: any) {
        res.status(500).json({ error: error.message }); // Xử lý lỗi
    }
};

// Lấy tất cả các đơn hàng của một khách hàng dựa trên CustomerId
export const getOrdersByCustomerId = async (req: Request, res: Response): Promise<void> => {
    try {
        const customerId = Number(req.params.customerId); // Lấy CustomerId từ URL
        const orders = await getOrdersByCustomerIdService(customerId); // Gọi service để lấy dữ liệu

        if (!orders || orders.length === 0) {
            res.status(404).json({ error: 'No orders found for the given CustomerId' }); // Trả về lỗi nếu không tìm thấy đơn hàng
            return;
        }

        res.json(orders); // Trả về danh sách đơn hàng
    } catch (error: any) {
        res.status(500).json({ error: error.message }); // Xử lý lỗi
    }
};

// Lấy thông tin đơn hàng bao gồm thông tin khách hàng
export const getOrdersWithCustomerInfo = async (_: Request, res: Response): Promise<void> => {
    try {
        const orders = await getOrdersWithCustomerInfoService(); // Gọi service để lấy dữ liệu

        if (!orders || orders.length === 0) {
            res.status(404).json({ error: 'No orders found' }); // Trả về lỗi nếu không có dữ liệu
            return;
        }

        res.json(orders); // Trả về danh sách đơn hàng
    } catch (error: any) {
        console.error('Error fetching orders with customer info:', error);
        res.status(500).json({ error: error.message }); // Xử lý lỗi
    }
};

// Lấy danh sách các ngày trong tháng hiện tại mà không có đơn hàng nào được đặt
export const getDaysWithoutOrders = async (_: Request, res: Response): Promise<void> => {
    try {
        const daysWithoutOrders = await getDaysWithoutOrdersService(); // Gọi service để lấy danh sách ngày không có đơn hàng
        res.json(daysWithoutOrders); // Trả về danh sách ngày
    } catch (error: any) {
        console.error('Error fetching days without orders:', error); // Ghi log lỗi
        res.status(500).json({ error: error.message }); // Xử lý lỗi
    }
};

// Lấy danh sách các ngày mà số lượng đơn hàng là cao thứ hai trong mỗi tháng
export const getSecondHighestOrderDaysPerMonth = async (_: Request, res: Response): Promise<void> => {
    try {
        const secondHighestOrderDays = await getSecondHighestOrderDaysPerMonthService(); // Gọi service để lấy dữ liệu
        res.json(secondHighestOrderDays); // Trả về danh sách ngày
    } catch (error: any) {
        console.error('Error fetching second highest order days:', error); // Ghi log lỗi
        res.status(500).json({ error: error.message }); // Xử lý lỗi
    }
};

export const getCustomerRankingByYear = async (_: Request, res: Response): Promise<void> => {
  try {
    console.log("==============================")
    const rankings = await getCustomerRankingByYearService(); // Gọi service để lấy dữ liệu
    res.json(rankings); // Trả về danh sách xếp hạng khách hàng
  } catch (error: any) {
    console.error('Error fetching customer rankings:', error);
    res.status(500).json({ error: error.message }); // Xử lý lỗi
  }
};