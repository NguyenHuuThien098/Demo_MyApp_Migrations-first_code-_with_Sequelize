import express from 'express';
import { getProducts, getProductById,createProduct,deleteProductById,updateProductById,
    getTopProductsInQ1,
    getTopProductsByQuarter
 } from '../controller/product/productController';

const router = express.Router();

router.get('/top-q1', getTopProductsInQ1); // Route để lấy sản phẩm có doanh số cao nhất trong quý 1// Route để lấy sản phẩm có doanh số cao nhất trong quý 1
router.get('/top-products', getTopProductsByQuarter); // Route để lấy sản phẩm có doanh số cao nhất theo quý

// Định nghĩa các route cho Products
//TĨNH
router.get('/', getProducts); 

//ĐỘNG
router.get('/:id', getProductById); 

//CRUD
router.post('/', createProduct); 
router.delete('/:id', deleteProductById); 
router.put('/:id', updateProductById); 
export default router;