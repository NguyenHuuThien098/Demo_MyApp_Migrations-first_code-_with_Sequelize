import { Request, Response } from 'express';
import {
    getAllOrdersService,
    getOrderByIdService,
    createOrderService,
    deleteOrderByIdService,
} from '../../services/orderService';

export const getOrders = async (_: Request, res: Response): Promise<void> => {
    try {
        const orders = await getAllOrdersService();
        res.json(orders);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const getOrderById = async (req: Request, res: Response): Promise<void> => {
    try {
        const order = await getOrderByIdService(Number(req.params.id));
        if (!order) {
            res.status(404).json({ error: 'Order not found' });
            return;
        }
        res.json(order);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const createOrder = async (req: Request, res: Response): Promise<void> => {
    try {
        const order = await createOrderService(req.body);
        res.status(201).json(order);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const deleteOrderById = async (req: Request, res: Response): Promise<void> => {
    try {
        const deleted = await deleteOrderByIdService(Number(req.params.id));
        if (!deleted) {
            res.status(404).json({ error: 'Order not found' });
            return;
        }
        res.status(204).send();
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};