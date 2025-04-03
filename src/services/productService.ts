import { fetchAllProducts, fetchProductById,createProduct,deleteProductById,updateProductById } from '../repository/productRepository';

export const fetchAllProductsService = async () => {
  return await fetchAllProducts(); // Gọi repository để lấy dữ liệu
};

export const fetchProductByIdService = async (id: number) =>{
  return await fetchProductById(id); // Lấy sản phẩm theo id
}

export const createProductService = async (productData: any) => {
  return await createProduct(productData);
};

// Xóa sản phẩm theo ID
export const deleteProductByIdService = async (id: number) => {
  return await deleteProductById(id);
};

// Sửa sản phẩm theo ID
export const updateProductByIdService = async (id: number, productData: any) => {
  return await updateProductById(id, productData);
};