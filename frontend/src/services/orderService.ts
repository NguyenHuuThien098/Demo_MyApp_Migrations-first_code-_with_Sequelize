import axios from 'axios';

const API_URL = 'http://localhost:8080/orders';

export const placeOrder = async (orderData: any) => {
  try {
    const response = await axios.post(API_URL, orderData);
    return response.data;
  } catch (error) {
    console.error('Error placing order:', error);
    throw error;
  }
};