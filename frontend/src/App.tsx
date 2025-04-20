import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './components/DashboardLayout';
import Dashboard from './pages/DashboardPage';
import CartPage from './pages/CartPage'; // Đổi tên từ OrderPage
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CartProvider } from './contexts/CartContext';

// Tạo theme cơ bản
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CartProvider>
        <Router>
          <DashboardLayout>
            <Routes>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </DashboardLayout>
        </Router>
      </CartProvider>
    </ThemeProvider>
  );
}

export default App;