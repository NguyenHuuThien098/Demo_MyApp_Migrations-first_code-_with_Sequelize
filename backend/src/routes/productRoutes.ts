import express from 'express';
import { ProductController } from '../controller/product/productController';

const router = express.Router();
const productController = new ProductController();

// Công khai - không yêu cầu xác thực
router.get('/search', productController.searchProducts.bind(productController)); // API tìm kiếm sản phẩm có phân trang
router.get('/top-products', productController.getTopProductsByQuarter.bind(productController)); // Lấy danh sách các sản phẩm có doanh số cao nhất theo quý
router.get('/', productController.getProducts.bind(productController)); // Lấy danh sách tất cả các sản phẩm
router.get('/never-ordered', productController.getProductsNeverOrdered.bind(productController)); // Lấy danh sách các sản phẩm chưa bao giờ được đặt hàng

// Động - yêu cầu xác thực
router.get('/:id', productController.getProductById.bind(productController)); // Lấy thông tin chi tiết của một sản phẩm theo ID

// CRUD - yêu cầu xác thực
router.post('/', productController.createProduct.bind(productController)); // Tạo mới một sản phẩm
router.delete('/:id', productController.deleteProductById.bind(productController)); // Xóa sản phẩm theo ID
router.put('/:id', productController.updateProductById.bind(productController)); // Cập nhật thông tin của một sản phẩm theo ID

export default router;