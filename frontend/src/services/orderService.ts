import axios from 'axios';
import { API_ENDPOINTS, getApiUrl } from '../utils/apiConfig';

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
    const response = await axios.post(getApiUrl(API_ENDPOINTS.ORDERS), orderData);
    return response.data;
  } catch (error: any) {
    // Xử lý các lỗi cụ thể từ API
    if (axios.isAxiosError(error)) {
      if (error.response) {
        // Lỗi từ phía server với response
        throw new Error(error.response.data.error || 'Lỗi khi tạo đơn hàng');
      } else if (error.request) {
        // Yêu cầu được gửi nhưng không nhận được phản hồi
        throw new Error('Không thể kết nối tới máy chủ. Vui lòng kiểm tra kết nối của bạn.');
      }
    }
    // Lỗi tổng quát
    console.error('Lỗi khi tạo đơn hàng:', error);
    throw error;
  }
};

/**
 * Lấy danh sách tất cả đơn hàng
 * 
 * @returns Mảng các đối tượng đơn hàng
 */
export const getOrders = async () => {
  try {
    const response = await axios.get(getApiUrl(API_ENDPOINTS.ORDERS));
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
    const response = await axios.get(getApiUrl(API_ENDPOINTS.ORDERS, `/${orderId}`));
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy chi tiết đơn hàng:', error);
    throw error;
  }
};