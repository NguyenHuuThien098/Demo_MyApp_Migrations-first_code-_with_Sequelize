import { Request, Response } from 'express';
import { ShipperService } from '../../services/shipperService';

export class ShipperController {
  private shipperService: ShipperService;

  constructor() {
    this.shipperService = new ShipperService();
  }

  public async getShippers(_: Request, res: Response): Promise<void> {
    try {
      const shippers = await this.shipperService.fetchAllShippers();
      res.json(shippers);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  public async getShipperById(req: Request, res: Response): Promise<void> {
    try {
      const shipperId = Number(req.params.id);
      if (isNaN(shipperId)) {
        res.status(400).json({ error: 'Invalid shipper ID' });
        return;
      }

      const shipper = await this.shipperService.fetchShipperById(shipperId);
      if (!shipper) {
        res.status(404).json({ error: 'Shipper not found' });
        return;
      }

      res.json(shipper);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  public async createShipper(req: Request, res: Response): Promise<void> {
    try {
      const shipper = await this.shipperService.createShipper(req.body);
      res.status(201).json(shipper);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  public async deleteShipperById(req: Request, res: Response): Promise<void> {
    try {
      const shipperId = Number(req.params.id);
      if (isNaN(shipperId)) {
        res.status(400).json({ error: 'Invalid shipper ID' });
        return;
      }

      const deleted = await this.shipperService.deleteShipperById(shipperId);
      if (!deleted) {
        res.status(404).json({ error: 'Shipper not found' });
        return;
      }

      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  public async updateShipperById(req: Request, res: Response): Promise<void> {
    try {
      const shipperId = Number(req.params.id);
      if (isNaN(shipperId)) {
        res.status(400).json({ error: 'Invalid shipper ID' });
        return;
      }

      const [updatedCount, updatedShippers] = await this.shipperService.updateShipperById(shipperId, req.body);
      if (updatedCount === 0) {
        res.status(404).json({ error: 'Shipper not found' });
        return;
      }

      res.json(updatedShippers[0]);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}