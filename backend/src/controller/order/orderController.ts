import { Request, Response } from 'express';
import { OrderService } from '../../services/orderService';

export class OrderController {
    private orderService: OrderService;

    constructor() {
        this.orderService = new OrderService();
    }

    public async getOrders(_: Request, res: Response): Promise<void> {
        try {
            const orders = await this.orderService.fetchAllOrders();
            res.json(orders);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    public async getOrderById(req: Request, res: Response): Promise<void> {
        try {
            const orderId = Number(req.params.id);
            if (isNaN(orderId)) {
                res.status(400).json({ error: 'Invalid order ID' });
                return;
            }
            const order = await this.orderService.fetchOrderById(orderId);
            if (!order) {
                res.status(404).json({ error: 'Order not found' });
                return;
            }
            res.json(order);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    public async createOrder(req: Request, res: Response): Promise<void> {
        try {
            const { customerId, shipperId, orderDetails } = req.body;

            // Kiểm tra dữ liệu đầu vào
            if (!customerId || !shipperId || !Array.isArray(orderDetails) || orderDetails.length === 0) {
                res.status(400).json({ error: 'Invalid input data' });
                return;
            }

            // Gọi service để tạo đơn hàng
            const order = await this.orderService.createOrder({
                customerId,
                shipperId,
                orderDetails,
            });

            res.status(201).json(order);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    public async deleteOrderById(req: Request, res: Response): Promise<void> {
        try {
            const orderId = Number(req.params.id);
            if (isNaN(orderId)) {
                res.status(400).json({ error: 'Invalid order ID' });
                return;
            }
            const deleted = await this.orderService.deleteOrderById(orderId);
            if (!deleted) {
                res.status(404).json({ error: 'Order not found' });
                return;
            }
            res.status(204).send();
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    public async getOrdersByCustomerId(req: Request, res: Response): Promise<void> {
        try {
            const customerId = Number(req.params.customerId);
            if (isNaN(customerId)) {
                res.status(400).json({ error: 'Invalid customer ID' });
                return;
            }
            const orders = await this.orderService.fetchOrdersByCustomerId(customerId);
            if (!orders || orders.length === 0) {
                res.status(404).json({ error: 'No orders found for the given CustomerId' });
                return;
            }
            res.json(orders);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    public async getOrdersWithCustomerInfo(_: Request, res: Response): Promise<void> {
        try {
            const orders = await this.orderService.fetchOrdersWithCustomerInfo();
            if (!orders || orders.length === 0) {
                res.status(404).json({ error: 'No orders found' });
                return;
            }
            res.json(orders);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    public async getDaysWithoutOrdersForMonth(req: Request, res: Response): Promise<void> {
        try {
            const year = parseInt(req.query.year as string, 10);
            const month = parseInt(req.query.month as string, 10);

            if (isNaN(year) || isNaN(month) || month < 1 || month > 12) {
                res.status(400).json({ error: 'Invalid year or month' });
                return;
            }

            const days = await this.orderService.fetchDaysWithoutOrdersForMonth(year, month);
            res.json(days);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    public async getSecondHighestOrderDaysPerMonth(_: Request, res: Response): Promise<void> {
        try {
            const secondHighestOrderDays = await this.orderService.fetchSecondHighestOrderDaysPerMonth();
            res.json(secondHighestOrderDays);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    public async getCustomerRankingByYear(_: Request, res: Response): Promise<void> {
        try {
            const rankings = await this.orderService.fetchCustomerRankingByYear();
            res.json(rankings);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    public async getOrderDetails(_: Request, res: Response): Promise<void> {

        try {
            const orderDetails = await this.orderService.fetchOrderDetails();
            res.json(orderDetails);
        } catch (error: any) {

            res.status(500).json({ error: error.message });
        }
    }

    public async getTotalAmountByCountry(_: Request, res: Response): Promise<void> {
        try {
            const totalAmountByCountry = await this.orderService.fetchTotalAmountByCountry();
            res.json(totalAmountByCountry);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    public async getOrdersWithTotalAmountGreaterThan1000(_: Request, res: Response): Promise<void> {
        try {
            const orders = await this.orderService.fetchOrdersWithTotalAmountGreaterThan1000();
            res.json(orders);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    public async getOrdersAboveAverage(_: Request, res: Response): Promise<void> {
        try {
            const orders = await this.orderService.fetchOrdersAboveAverage();
            res.json(orders);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    public async searchOrders(req: Request, res: Response): Promise<void> {
        try {
            const page = parseInt(req.query.page as string) || 1;
            let pageSize = parseInt(req.query.pageSize as string) || 10;

            if (pageSize > 50) {
                pageSize = 50;
            }

            const searchQuery = req.query.searchQuery as string || '';
            
            // Extract filter parameters
            const filters: any = {};
            
            // Date filters
            if (req.query.startDate) {
                filters.startDate = req.query.startDate;
            }
            
            if (req.query.endDate) {
                filters.endDate = req.query.endDate;
            }
            
            // Shipper filter
            if (req.query.shipperId) {
                filters.shipperId = parseInt(req.query.shipperId as string);
            }
            
            // Sorting
            if (req.query.orderBy) {
                filters.orderBy = req.query.orderBy as string;
            }
            
            if (req.query.orderDirection && ['ASC', 'DESC'].includes((req.query.orderDirection as string).toUpperCase())) {
                filters.orderDirection = (req.query.orderDirection as string).toUpperCase();
            }

            const result = await this.orderService.searchOrders(page, pageSize, searchQuery, filters);
            
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

    public async orderProductById(req: Request, res: Response): Promise<void> {
        try {
          const { productId, quantity } = req.body;
    
          if (!productId || !quantity || quantity <= 0) {
            res.status(400).json({ error: 'Invalid product ID or quantity' });
            return;
          }
    
          if (!req.user?.id) {
            res.status(401).json({ error: 'User not authenticated' });
            return;
          }
    
          const order = await this.orderService.orderProductById(req.user.id, productId, quantity);
    
          res.status(201).json({ success: true, data: order });
        } catch (error: any) {
          res.status(500).json({ error: error.message });
        }
      }
}