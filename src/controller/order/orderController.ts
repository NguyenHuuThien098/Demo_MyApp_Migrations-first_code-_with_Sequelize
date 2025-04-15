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
            const order = await this.orderService.createOrder(req.body);
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

    public async getDaysWithoutOrders(_: Request, res: Response): Promise<void> {
        try {
            const daysWithoutOrders = await this.orderService.fetchDaysWithoutOrders();
            res.json(daysWithoutOrders);
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
}