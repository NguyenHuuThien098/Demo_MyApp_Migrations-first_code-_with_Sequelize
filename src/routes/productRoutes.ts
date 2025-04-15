import express from 'express';
import { ProductController } from '../controller/product/productController';

const router = express.Router();
const productController = new ProductController();

// TĨNH
router.get('/top-q1', productController.getTopProductsInQ1.bind(productController));// Lấy danh sách các sản phẩm có doanh số cao nhất trong quý 1
router.get('/top-products', productController.getTopProductsByQuarter.bind(productController));// Lấy danh sách các sản phẩm có doanh số cao nhất theo quý (dựa trên tham số `quarter`)
router.get('/', productController.getProducts.bind(productController));// Lấy danh sách tất cả các sản phẩm
router.get('/never-ordered', productController.getProductsNeverOrdered.bind(productController));// Lấy danh sách các sản phẩm chưa bao giờ được đặt hàng

// ĐỘNG
router.get('/:id', productController.getProductById.bind(productController));// Lấy thông tin chi tiết của một sản phẩm theo ID

// CRUD
router.post('/', productController.createProduct.bind(productController));// Tạo mới một sản phẩm
router.delete('/:id', productController.deleteProductById.bind(productController));// Xóa sản phẩm theo id
router.put('/:id', productController.updateProductById.bind(productController));// cập nhập thông tin của 1 product theo id

export default router;