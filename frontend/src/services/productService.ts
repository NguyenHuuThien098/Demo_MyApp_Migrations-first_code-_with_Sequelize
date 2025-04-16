import axios from 'axios';

const API_URL = 'http://localhost:8080/products'; // URL của API backend

export const fetchProducts = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data; // Trả về danh sách sản phẩm
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};