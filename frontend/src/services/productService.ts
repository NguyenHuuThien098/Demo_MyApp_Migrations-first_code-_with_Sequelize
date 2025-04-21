import axios from 'axios';
import { API_ENDPOINTS, getApiUrl } from '../utils/apiConfig';

/**
 * Lấy danh sách sản phẩm với tính năng tìm kiếm và phân trang
 * 
 * @param searchText - Từ khóa tìm kiếm sản phẩm theo tên
 * @param page - Số trang hiện tại (bắt đầu từ 1)
 * @param pageSize - Số lượng sản phẩm trên một trang
 * @returns Đối tượng chứa mảng dữ liệu sản phẩm và tổng số sản phẩm
 */
export const fetchProducts = async (searchText: string = '', page: number = 1, pageSize: number = 10) => {
  try {
    const response = await axios.get(getApiUrl(API_ENDPOINTS.PRODUCTS, '/search'), {
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
    console.error('Lỗi khi lấy danh sách sản phẩm:', error);
    throw error;
  }
};

/**
 * Lấy thông tin chi tiết của một sản phẩm theo ID
 * 
 * @param productId - ID của sản phẩm cần lấy thông tin
 * @returns Đối tượng chứa chi tiết sản phẩm
 */
export const fetchProductById = async (productId: number) => {
  try {
    const response = await axios.get(getApiUrl(API_ENDPOINTS.PRODUCTS, `/${productId}`));
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy chi tiết sản phẩm:', error);
    throw error;
  }
};