import express from 'express';
import { getShippers, getShipperById,createShipper, deleteShipperById,updateShipperById} from '../controller/shipper/shipperController';

const router = express.Router();

// Định nghĩa các route cho Shippers
// TĨNH
router.get('/', getShippers); // Lấy tất cả shipper

//ĐỘNG
router.get('/:id', getShipperById); // Lấy shipper theo ID

// CRUD
router.post('/', createShipper); // Thêm shipper mới
router.delete('/:id', deleteShipperById); // Xóa shipper theo ID
router.put('/:id', updateShipperById); // Sửa shipper theo ID



export default router;