import axios from 'axios';

const API_URL = 'http://localhost:8080/products';

export const fetchProducts = async (searchText: string = '', page: number = 1, pageSize: number = 10) => {
  try {
    const response = await axios.get(`${API_URL}/search`, {
      params: {
        nameProduct: searchText,
        page,
        pageSize,
      },
    });
    
    if (response.data && response.data.data) {
      return {
        data: response.data.data,
        total: response.data.total || response.data.data.length
      };
    }
    
    return {
      data: [],
      total: 0
    };
    
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const fetchProductById = async (productId: number) => {
  try {
    const response = await axios.get(`${API_URL}/${productId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching product details:', error);
    throw error;
  }
};