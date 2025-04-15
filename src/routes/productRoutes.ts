// import express from 'express';
// import { getProducts, getProductById,createProduct,deleteProductById,updateProductById,
//     getTopProductsInQ1,
//     getTopProductsByQuarter
//  } from '../controller/product/productController';

// const router = express.Router();

// //TĨNH
// router.get('/top-q1', getTopProductsInQ1); // Route để lấy sản phẩm có doanh số cao nhất trong quý 1// Route để lấy sản phẩm có doanh số cao nhất trong quý 1
// router.get('/top-products', getTopProductsByQuarter); // Route để lấy sản phẩm có doanh số cao nhất theo quý
// router.get('/', getProducts); 

// //ĐỘNG
// router.get('/:id', getProductById); 

// //CRUD
// router.post('/', createProduct); 
// router.delete('/:id', deleteProductById); 
// router.put('/:id', updateProductById); 
// export default router;

import express from 'express';
import { ProductController } from '../controller/product/productController';

const router = express.Router();
const productController = new ProductController();

// TĨNH
router.get('/top-q1', productController.getTopProductsInQ1.bind(productController));
router.get('/top-products', productController.getTopProductsByQuarter.bind(productController));
router.get('/', productController.getProducts.bind(productController));
router.get('/never-ordered', productController.getProductsNeverOrdered.bind(productController));

// ĐỘNG
router.get('/:id', productController.getProductById.bind(productController));

// CRUD
router.post('/', productController.createProduct.bind(productController));
router.delete('/:id', productController.deleteProductById.bind(productController));
router.put('/:id', productController.updateProductById.bind(productController));

export default router;