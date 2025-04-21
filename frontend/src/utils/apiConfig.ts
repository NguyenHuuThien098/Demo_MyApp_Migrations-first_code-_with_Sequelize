/**
 * Cấu hình API endpoints cho toàn bộ ứng dụng
 * Tập trung quản lý URL cơ sở cho các API, giúp dễ dàng thay đổi khi triển khai ở môi trường khác
 */

// Xác định URL cơ sở tự động dựa trên môi trường
const getBaseUrl = (): string => {
  return process.env.REACT_APP_API_URL || "http://localhost:8080";
};

/**
 * URL cơ sở cho API
 */
export const BASE_API_URL = getBaseUrl();

/**
 * Các endpoints cụ thể cho từng loại tài nguyên
 */
export const API_ENDPOINTS = {
  // Sản phẩm
  PRODUCTS: `${BASE_API_URL}/products`,
  
  // Đơn hàng
  ORDERS: `${BASE_API_URL}/orders`,
  
  // Khách hàng
  CUSTOMERS: `${BASE_API_URL}/customers`,
  
  // Chi tiết đơn hàng
  ORDER_DETAILS: `${BASE_API_URL}/orderdetails`,
  
  // Shipper
  SHIPPERS: `${BASE_API_URL}/shippers`,
};

/**
 * Phương thức tạo URL đầy đủ cho một endpoint
 * 
 * @param endpoint - Endpoint cơ sở, ví dụ: API_ENDPOINTS.PRODUCTS
 * @param path - Đường dẫn bổ sung, ví dụ: '/search' hoặc '/1'
 * @returns URL đầy đủ
 */
export const getApiUrl = (endpoint: string, path: string = ''): string => {
  return `${endpoint}${path}`;
};

