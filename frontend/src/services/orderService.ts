import axios from 'axios';

const API_URL = 'http://localhost:8080/orders';

// Đặt hàng
export const placeOrder = async (orderData: {
  customerId: number;
  shipperId: number;
  paymentMethod: string;
  orderDetails: { productId: number; quantity: number }[];
}) => {
  try {
    const response = await axios.post(API_URL, orderData);
    return response.data;
  } catch (error) {
    console.error('Error placing order:', error);
    throw error;
  }
};

// Lấy danh sách đơn hàng 
export const fetchOrders = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};