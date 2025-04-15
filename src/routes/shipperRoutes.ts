import express from 'express';
import { ShipperController } from '../controller/shipper/shipperController';

const router = express.Router();
const shipperController = new ShipperController();

//TĨNH
router.get('/', shipperController.getShippers.bind(shipperController)); // Lấy tất cả shipper

// ĐỘNG
router.get('/:id', shipperController.getShipperById.bind(shipperController)); // Lấy shipper theo ID

// CRUD
router.post('/', shipperController.createShipper.bind(shipperController)); // Thêm shipper mới
router.delete('/:id', shipperController.deleteShipperById.bind(shipperController)); // Xóa shipper theo ID
router.put('/:id', shipperController.updateShipperById.bind(shipperController)); // Sửa shipper theo ID

export default router;