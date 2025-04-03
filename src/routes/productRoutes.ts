import express from 'express';
import { getProducts, getProductById,createProduct,deleteProductById,updateProductById } from '../controller/product/productController';

const router = express.Router();

// Định nghĩa các route cho Products
router.get('/', getProducts); 
router.get('/:id', getProductById); 
router.post('/', createProduct); 
router.delete('/:id', deleteProductById); 
router.put('/:id', updateProductById); 

export default router;