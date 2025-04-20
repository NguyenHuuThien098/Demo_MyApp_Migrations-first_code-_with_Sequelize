import React, { useState, useEffect, useCallback } from 'react';
import { Typography, TextField, InputAdornment, Button, Snackbar, Alert } from '@mui/material';
import Box from '@mui/material/Box';
import SearchIcon from '@mui/icons-material/Search';
import ProductCard from '../components/ProductCard';
import { fetchProducts } from '../services/productService';
import { useCart } from '../contexts/CartContext';

interface Product {
  id: number;
  name: string;
  unitPrice: number;
  quantity: number;
  description?: string;
  imageUrl?: string;
}

const DashboardPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchText, setSearchText] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');
  const { addToCart } = useCart();

  // Fetch products
  const loadProducts = useCallback(async () => {
    try {
      const result = await fetchProducts(searchText);
      setProducts(Array.isArray(result.data) ? result.data : []);
      setError(null);
    } catch (err) {
      setError('Failed to load products');
      setProducts([]);
      console.error('Error loading products:', err);
    }
  }, [searchText]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // Handle search
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  const handleSearch = () => {
    loadProducts();
  };

  // Cart functions
  const handleAddToCart = (product: Product) => {
    addToCart(product);
    
    // Show success message
    setSnackbarMessage(`${product.name} added to cart!`);
    setSnackbarOpen(true);
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Product Showcase
      </Typography>

      {/* Search bar */}
      <Box sx={{ display: 'flex', mb: 4, maxWidth: 600 }}>
        <TextField
          fullWidth
          placeholder="Search products..."
          value={searchText}
          onChange={handleSearchChange}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <Button 
          variant="contained" 
          onClick={handleSearch} 
          sx={{ ml: 1 }}
        >
          Search
        </Button>
      </Box>

      {error && (
        <Typography color="error" sx={{ mb: 3 }}>
          {error}
        </Typography>
      )}

      {/* Products grid */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
            lg: 'repeat(4, 1fr)',
          },
          gap: 3,
        }}
      >
        {products.length > 0 ? (
          products.map((product) => (
            <Box key={product.id}>
              <ProductCard
                product={product}
                onAddToCart={handleAddToCart}
              />
            </Box>
          ))
        ) : null}
      </Box>

      {/* No Products Found Message */}
      {!error && products.length === 0 && (
        <Box sx={{ py: 5, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            No products found. Try a different search term.
          </Typography>
        </Box>
      )}

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setSnackbarOpen(false)} 
          severity="success" 
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default DashboardPage;