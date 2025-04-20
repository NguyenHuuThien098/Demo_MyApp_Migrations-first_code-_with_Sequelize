import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Pagination from '@mui/material/Pagination';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import RefreshIcon from '@mui/icons-material/Refresh';
import Paper from '@mui/material/Paper';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';

interface Product {
  id: number;
  name: string;
  unitPrice: number;
  quantity: number;
}

interface ProductListProps {
  onAddToCart: (product: Product) => void;
}

const ProductList: React.FC<ProductListProps> = ({ onAddToCart }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchText, setSearchText] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [pageSize] = useState<number>(10);
  const [total, setTotal] = useState<number>(0);

  const fetchProducts = useCallback(async () => {
    setError(null);
    
    try {
      const response = await axios.get('http://localhost:8080/products/search', {
        params: {
          page,
          pageSize,
          nameProduct: searchText,
        },
      });
      setProducts(response.data.data);
      setTotal(response.data.total);
    } catch (err) {
      // Xử lý các loại lỗi khác nhau
      if (axios.isAxiosError(err)) {
        if (err.code === 'ECONNABORTED') {
          setError('Connection timeout. Please try again.');
        } else if (err.response?.status === 404) {
          setError('Products not found. Try a different search term.');
        } else if (err.response?.status === 500) {
          setError('Server error. Our team has been notified.');
        } else if (!navigator.onLine) {
          setError('You appear to be offline. Please check your internet connection.');
        } else {
          setError('Failed to fetch products. Please try again later.');
        }
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    }
  }, [page, pageSize, searchText]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleSearch = () => {
    setPage(1);
    fetchProducts();
  };

  // Xử lý sự kiện khi nhấn Enter trong input search
  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  return (
    <article>
      <Box sx={{ padding: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {/* Search Bar - Always show this */}
        <Box component="section" sx={{ display: 'flex', gap: 2, marginBottom: 3, width: '100%', maxWidth: '800px' }}>
          <TextField
            fullWidth
            label="Search products"
            variant="outlined"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onKeyDown={handleSearchKeyDown}
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
            sx={{ whiteSpace: 'nowrap' }}
          >
            Search
          </Button>
        </Box>

        {/* Error Message if applicable */}
        {error && (
          <Paper 
            elevation={0} 
            sx={{ 
              width: '100%', 
              maxWidth: '800px', 
              mb: 3, 
              p: 2, 
              border: '1px solid #f1f1f1',
              backgroundColor: '#FFEBEE' 
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <ErrorOutlineIcon color="error" />
              <Typography variant="body1" color="error">{error}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Button 
                startIcon={<RefreshIcon />} 
                onClick={fetchProducts}
                variant="outlined" 
                color="error"
              >
                Try Again
              </Button>
            </Box>
          </Paper>
        )}

        {/* Product Table */}
        {products.length > 0 && (
          <Box component="section" sx={{ width: '100%', maxWidth: '800px', overflowX: 'auto', marginBottom: 3 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center' }}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Unit Price</th>
                  <th>Quantity</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td>{product.id}</td>
                    <td>{product.name}</td>
                    <td>${product.unitPrice}</td>
                    <td>{product.quantity}</td>
                    <td>
                      <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddShoppingCartIcon />}
                        onClick={() => onAddToCart(product)}
                      >
                        Order
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Box>
        )}

        {/* No Products Found Message */}
        {!error && products.length === 0 && (
          <Alert severity="info" sx={{ width: '100%', maxWidth: '800px', mb: 3 }}>
            No products found. Try a different search term.
          </Alert>
        )}

        {/* Pagination - Show only if there are products */}
        {products.length > 0 && (
          <Box component="nav" sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
            <Pagination
              count={Math.ceil(total / pageSize)}
              page={page}
              onChange={handlePageChange}
              color="primary"
            />
          </Box>
        )}
      </Box>
    </article>
  );
};

export default ProductList;