import axios from 'axios';

const API_URL = 'http://localhost:8080/products';

// Lấy danh sách sản phẩm
export const fetchProducts = async (searchText: string = '', page: number = 1, pageSize: number = 10) => {
  try {
    const response = await axios.get(API_URL, {
      params: {
        nameProduct: searchText,
        page,
        pageSize,
      },
    });
    return response.data; // Trả về danh sách sản phẩm
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

// Lấy chi tiết sản phẩm (nếu cần)
export const fetchProductById = async (productId: number) => {
  try {
    const response = await axios.get(`${API_URL}/${productId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching product details:', error);
    throw error;
  }
};