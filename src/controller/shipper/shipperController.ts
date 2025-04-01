import { Request, Response } from 'express';
import { fetchAllShippersService } from '../../services/shipperService';

export const getShippers = async (_: Request, res: Response): Promise<void> => {
  try {
    const shippers = await fetchAllShippersService();
    res.json(shippers);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};