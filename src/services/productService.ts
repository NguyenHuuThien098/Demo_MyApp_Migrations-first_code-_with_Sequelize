import {
  fetchAllProducts, fetchProductById, createProduct, deleteProductById,
  updateProductById,
  fetchTopProductsInQ1,
  fetchTopProductsByQuarter
} from '../repository/productRepository';

export const fetchAllProductsService = async () => {
  return await fetchAllProducts(); // Gọi repository để lấy dữ liệu
};

export const fetchProductByIdService = async (id: number) => {
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

export const fetchTopProductsInQ1Service = async () => {
  return await fetchTopProductsInQ1(); // Gọi repository để lấy danh sách sản phẩm có doanh số cao nhất trong quý 1
};

export const fetchTopProductsByQuarterService = async (quarter: number) => {
  // Tính toán tháng bắt đầu và kết thúc dựa trên quý
  const startMonth = (quarter - 1) * 3 + 1; // Tháng bắt đầu của quý
  const endMonth = startMonth + 2; // Tháng kết thúc của quý

  return await fetchTopProductsByQuarter(startMonth, endMonth); // Gọi repository để lấy dữ liệu
};