import React, { useState } from 'react';
import ProductList from '../components/ProductList';
import Cart from '../components/Cart';
import { placeOrder } from '../services/orderService';

interface Product {
  id: number;
  name: string;
  unitPrice: number;
  quantity: number;
  isPurchased?: boolean; // trạng thái đã mua
}

const OrderPage: React.FC = () => {
  const [cartItems, setCartItems] = useState<Product[]>([]);

  // Thêm sản phẩm vào giỏ hàng
  const handleAddToCart = (product: Product) => {
    const existingItem = cartItems.find((item) => item.id === product.id);
    if (existingItem) {
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCartItems((prevItems) => [...prevItems, { ...product, quantity: 1 }]);
    }
  };

  // Xóa sản phẩm khỏi giỏ hàng
  const handleRemoveItem = (id: number) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  // Xử lý thanh toán
  const handleBuy = async (paymentMethod: string) => {
    try {
      const orderData = {
        customerId: 1, // ID khách hàng
        shipperId: 1, // ID đơn vị vận chuyển
        paymentMethod,
        orderDetails: cartItems.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
        })),
      };
      const response = await placeOrder(orderData);
      console.log('Order placed successfully:', response);

      // Cập nhật trạng thái "Đã mua" cho các sản phẩm trong giỏ hàng
      setCartItems((prevItems) =>
        prevItems.map((item) => ({
          ...item,
          isPurchased: true, // Đánh dấu sản phẩm đã mua
        }))
      );

      alert('Order placed successfully!');
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order.');
    }
  };

  return (
    <div>
      {/* Danh sách sản phẩm */}
      <ProductList onAddToCart={handleAddToCart} />

      {/* Giỏ hàng */}
      <Cart
        items={cartItems}
        onRemoveItem={handleRemoveItem}
        onBuy={handleBuy} // Truyền hàm xử lý thanh toán vào Cart
      />
    </div>
  );
};

export default OrderPage;