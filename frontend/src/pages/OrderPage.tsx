import React, { useState } from 'react';
import ProductList from '../components/ProductList';
import Cart from '../components/Cart';
import axios from 'axios';

interface Product {
  id: number;
  name: string;
  unitPrice: number;
  quantity: number;
}

const OrderPage: React.FC = () => {
  const [cartItems, setCartItems] = useState<Product[]>([]);

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

  const handleRemoveItem = (id: number) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const handleBuy = async () => {
    try {
      const response = await axios.post('http://localhost:8080/orders', {
        items: cartItems.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
        })),
      });
      console.log('Order placed successfully:', response.data);
      alert('Order placed successfully!');
      setCartItems([]); // Clear cart after successful order
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order.');
    }
  };

  return (
    <div>
      <ProductList onAddToCart={handleAddToCart} />
      <Cart items={cartItems} onRemoveItem={handleRemoveItem} onBuy={handleBuy} />
    </div>
  );
};

export default OrderPage;