import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './components/DashboardLayout';
import Dashboard from './pages/DashboardPage';
import CartPage from './pages/CartPage'; 
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CartProvider } from './contexts/CartContext';

/**
 * Application theme configuration
 * Defines primary and secondary color palette for consistent UI
 */
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

/**
 * Root application component that:
 * - Provides MUI theme using ThemeProvider
 * - Wraps the app with CartProvider for global state management
 * - Configures routing with React Router
 * - Renders the main layout with route components
 */
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