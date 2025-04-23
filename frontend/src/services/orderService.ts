import { API_ENDPOINTS, API_BASE_URL, STORAGE_KEYS,getApiUrl } from '../utils/apiConfig';
import axiosInstance from '../utils/axios.config';
import axios from 'axios';

/**
 * Cấu trúc dữ liệu cho một sản phẩm trong đơn hàng
 */
interface OrderItem {
  productId: number;
  quantity: number;
}

/**
 * Cấu trúc dữ liệu đầy đủ cho một đơn hàng mới
 */
interface OrderData {
  customerId: number;
  shipperId: number;
  paymentMethod: string;
  orderDetails: OrderItem[];
}

/**
 * Tạo một đơn hàng mới trong hệ thống
 * 
 * @param orderData - Thông tin đơn hàng bao gồm: khách hàng, đơn vị vận chuyển, phương thức thanh toán và các sản phẩm
 * @returns Đơn hàng đã được tạo từ máy chủ
 * @throws Error nếu có vấn đề về tồn kho hoặc lỗi khác
 */
export const placeOrder = async (orderData: OrderData) => {
  try {
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    if (!token) {
      throw new Error('Bạn cần đăng nhập để đặt hàng.');
    }

    console.log('Placing order with data:', orderData);
    
    // Sử dụng axiosInstance thay vì axios trực tiếp
    const response = await axiosInstance.post(
      `${API_BASE_URL}${API_ENDPOINTS.ORDERS}`,
      orderData
    );

    console.log('Order response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Error placing order:', error.response || error);
    
    // Hiển thị chi tiết lỗi từ backend
    if (error.response?.data?.error) {
      throw new Error(error.response.data.error);
    } else if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error('Không thể đặt hàng. Vui lòng thử lại sau.');
    }
  }
};

/**
 * Lấy danh sách tất cả đơn hàng
 * 
 * @returns Mảng các đối tượng đơn hàng
 */
export const getOrders = async () => {
  try {
    const response = await axiosInstance.get(getApiUrl(API_ENDPOINTS.ORDERS));
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách đơn hàng:', error);
    throw error;
  }
};

/**
 * Lấy thông tin chi tiết của một đơn hàng theo ID
 * 
 * @param orderId - ID của đơn hàng cần xem chi tiết
 * @returns Đối tượng đơn hàng bao gồm các sản phẩm trong đơn
 */
export const getOrderById = async (orderId: number) => {
  try {
    const response = await axiosInstance.get(getApiUrl(API_ENDPOINTS.ORDERS, `/${orderId}`));
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy chi tiết đơn hàng:', error);
    throw error;
  }
};

/**
 * Lấy lịch sử đơn hàng của khách hàng hiện tại
 * 
 * @returns Danh sách đơn hàng của khách hàng
 */
export const getCustomerOrderHistory = async () => {
  try {
    const response = await axiosInstance.get(
      getApiUrl(API_ENDPOINTS.CUSTOMER.ORDERS)
    );
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy lịch sử đơn hàng:', error);
    throw error;
  }
};

/**
 * Lấy chi tiết một đơn hàng cụ thể của khách hàng
 * 
 * @param orderId - ID của đơn hàng cần xem chi tiết
 * @returns Chi tiết đơn hàng
 */
export const getCustomerOrderDetails = async (orderId: number) => {
  try {
    const response = await axiosInstance.get(
      getApiUrl(API_ENDPOINTS.CUSTOMER.ORDERS, `/${orderId}`)
    );
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy chi tiết đơn hàng:', error);
    throw error;
  }
};