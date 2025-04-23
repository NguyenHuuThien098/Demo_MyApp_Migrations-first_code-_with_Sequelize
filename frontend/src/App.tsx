import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Context providers
import { CartProvider } from './contexts/CartContext';
import { AuthProvider } from './contexts/AuthContext';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/admin/Dashboard';
import CartPage from './pages/CartPage';
import NotFound from './pages/NotFound';
import Unauthorized from './pages/Unauthorized';
import AdminDashboard from './pages/admin/Dashboard';

// Custom routes
import PrivateRoute from './components/routes/PrivateRoute';
import PublicRoute from './components/routes/PublicRoute';

// Create theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
      light: '#4791db',
      dark: '#115293',
    },
    secondary: {
      main: '#dc004e',
      light: '#e33371',
      dark: '#9a0036',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    button: {
      textTransform: 'none',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
});

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <CartProvider>
          <Router>
            <Routes>
              {/* Homepage - accessible to everyone */}
              <Route path="/" element={<Home />} />
              
              {/* Auth routes - only for non-authenticated users */}
              <Route element={<PublicRoute />}>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
              </Route>
              
              {/* Error pages */}
              <Route path="/unauthorized" element={<Unauthorized />} />
              <Route path="/not-found" element={<NotFound />} />
              
              {/* Protected routes */}
              <Route element={<PrivateRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/cart" element={<CartPage />} />
              </Route>
              
              {/* Admin routes - restricted by role */}
              <Route 
                element={<PrivateRoute allowedRoles={['admin']} />}
              >
                <Route path="/admin" element={<AdminDashboard />} />
                {/* Other admin routes can be added here */}
              </Route>
              
              {/* Catch-all route to 404 */}
              <Route path="*" element={<Navigate to="/not-found" replace />} />
            </Routes>
          </Router>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;