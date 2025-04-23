import axios from 'axios';
import { API_ENDPOINTS, getApiUrl } from '../utils/apiConfig';

/**
 * Lấy danh sách sản phẩm với tính năng tìm kiếm và phân trang
 * 
 * @param searchText - Từ khóa tìm kiếm sản phẩm theo tên
 * @param page - Số trang hiện tại (bắt đầu từ 1)
 * @param pageSize - Số lượng sản phẩm trên một trang
 * @param minPrice - Giá tối thiểu (optional)
 * @param maxPrice - Giá tối đa (optional)
 * @param inStock - Chỉ lấy sản phẩm còn hàng (optional)
 * @param orderBy - Trường sắp xếp (optional)
 * @param orderDirection - Hướng sắp xếp: ASC hoặc DESC (optional)
 * @returns Đối tượng chứa mảng dữ liệu sản phẩm và tổng số sản phẩm
 */
export const fetchProducts = async (
  searchText: string = '', 
  page: number = 1, 
  pageSize: number = 10,
  minPrice?: number,
  maxPrice?: number,
  inStock?: boolean,
  orderBy?: string,
  orderDirection?: 'ASC' | 'DESC'
) => {
  try {
    console.log(`API call to: ${getApiUrl(API_ENDPOINTS.PRODUCTS, '/search')}`);
    
    const response = await axios.get(getApiUrl(API_ENDPOINTS.PRODUCTS, '/search'), {
      params: {
        nameProduct: searchText,  // Using the parameter name expected by the backend
        page,
        pageSize,
        ...(minPrice !== undefined && { minPrice }),
        ...(maxPrice !== undefined && { maxPrice }),
        ...(inStock !== undefined && { inStock }),
        ...(orderBy !== undefined && { orderBy }),
        ...(orderDirection !== undefined && { orderDirection }),
      },
      timeout: 10000, // Add timeout to prevent long-hanging requests
    });
    
    console.log('API Response:', response.data);
    
    // Handle potential response format issues
    if (response.data && response.data.success) {
      return {
        data: response.data.data || [],
        total: response.data.total || 0,
        page: response.data.page || page,
        pageSize: response.data.pageSize || pageSize
      };
    }
    
    // If response doesn't have the expected format
    console.warn('Unexpected response format:', response.data);
    return {
      data: [],
      total: 0,
      page,
      pageSize
    };
  } catch (error) {
    console.error('Error in fetchProducts service:', error);
    throw error; // Let the component handle the error
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