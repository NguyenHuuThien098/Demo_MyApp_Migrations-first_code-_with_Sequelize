import axios from 'axios';

const API_URL = 'http://localhost:8080/orders';

interface OrderItem {
  productId: number;
  quantity: number;
}

interface OrderData {
  customerId: number;
  shipperId: number;
  paymentMethod: string;
  orderDetails: OrderItem[];
}

export const placeOrder = async (orderData: OrderData) => {
  try {
    const response = await axios.post(API_URL, orderData);
    return response.data;
  } catch (error) {
    console.error('Error placing order:', error);
    throw error;
  }
};

export const getOrders = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};

export const getOrderById = async (orderId: number) => {
  try {
    const response = await axios.get(`${API_URL}/${orderId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching order details:', error);
    throw error;
  }
};