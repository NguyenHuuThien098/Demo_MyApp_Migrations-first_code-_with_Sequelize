import { fetchAllProducts } from '../repository/productRepository';

export const fetchAllProductsService = async () => {
  return await fetchAllProducts(); // Gọi repository để lấy dữ liệu
};