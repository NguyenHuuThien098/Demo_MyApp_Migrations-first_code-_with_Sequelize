import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DashboardLayout from './components/DashboardLayout';
import ProductList from './components/ProductList';
import Cart from './components/Cart';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import axios from 'axios';

interface Product {
  id: number;
  name: string;
  unitPrice: number;
  quantity: number;
}

function App() {
  const [cartItems, setCartItems] = useState<Product[]>([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

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
    setSnackbarOpen(true); // Hiển thị thông báo
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
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
    <Router>
      <DashboardLayout>
        <Routes>
          <Route
            path="/dashboard"
            element={<ProductList onAddToCart={handleAddToCart} />}
          />
          <Route
            path="/orders"
            element={
              <Cart
                items={cartItems}
                onRemoveItem={handleRemoveItem}
                onBuy={handleBuy}
              />
            }
          />
        </Routes>
        {/* Snackbar */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
            Product added to cart successfully!
          </Alert>
        </Snackbar>
      </DashboardLayout>
    </Router>
  );
}

export default App;