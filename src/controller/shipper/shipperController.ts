import { Request, Response } from 'express';
import { fetchAllShippersService, fetchShipperByIdService,createShipperService,deleteShipperByIdService,updateShipperByIdService } from '../../services/shipperService';

export const getShippers = async (_: Request, res: Response): Promise<void> => {
  try {
    const shippers = await fetchAllShippersService();
    res.json(shippers);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getShipperById = async (req: Request, res: Response): Promise<void> => {
  try {
    const shipperId = Number(req.params.id);
    const shipper = await fetchShipperByIdService(shipperId);

    if (!shipper) {
      res.status(404).json({ error: 'Shipper not found' });
      return;
    }

    res.json(shipper);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Thêm shipper mới
export const createShipper = async (req: Request, res: Response): Promise<void> => {
  try {
    const shipper = await createShipperService(req.body);
    res.status(201).json(shipper);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Xóa shipper theo ID
export const deleteShipperById = async (req: Request, res: Response): Promise<void> => {
  try {
    const shipperId = Number(req.params.id);
    const deleted = await deleteShipperByIdService(shipperId);

    if (!deleted) {
      res.status(404).json({ error: 'Shipper not found' });
      return;
    }

    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Sửa shipper theo ID
export const updateShipperById = async (req: Request, res: Response): Promise<void> => {
  try {
    const shipperId = Number(req.params.id);
    const [updatedCount, updatedShippers] = await updateShipperByIdService(shipperId, req.body);

    if (updatedCount === 0) {
      res.status(404).json({ error: 'Shipper not found' });
      return;
    }

    res.json(updatedShippers[0]); // Trả về shipper đã được cập nhật
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};