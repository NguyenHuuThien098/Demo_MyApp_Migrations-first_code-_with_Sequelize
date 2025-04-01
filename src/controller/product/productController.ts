import { Request, Response } from 'express';
import { fetchAllProductsService } from '../../services/productService';

export const getProducts = async (_: Request, res: Response): Promise<void> => {
  try {
    const products = await fetchAllProductsService();
    res.json(products);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};