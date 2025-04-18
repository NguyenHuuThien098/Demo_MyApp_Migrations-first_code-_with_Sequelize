import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Pagination from '@mui/material/Pagination';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';

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
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [selectedPayment, setSelectedPayment] = useState<string>('online');

  const fetchProducts = async (nameProduct: string, page: number, pageSize: number) => {
    try {
      const response = await axios.get('http://localhost:8080/products/search', {
        params: {
          page,
          pageSize,
          nameProduct,
        },
      });
      setProducts(response.data.data);
      setTotal(response.data.total);
    } catch (err) {
      setError('Failed to fetch products');
    }
  };

  useEffect(() => {
    fetchProducts(searchText, page, pageSize);
  }, [searchText, page, pageSize]);

  const handleSearch = () => {
    setPage(1);
    fetchProducts(searchText, 1, pageSize);
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleBuy = async () => {
    try {
      // Gửi API thanh toán
      const response = await axios.post('http://localhost:8080/checkout', {
        paymentMethod: selectedPayment,
      });
      console.log('Payment successful:', response.data);
      setOpenDialog(false); // Đóng dialog sau khi thanh toán thành công
    } catch (err) {
      console.error('Payment failed:', err);
    }
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handlePaymentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedPayment(event.target.value);
  };

  if (error) return <p>{error}</p>;

  return (
    <Box sx={{ padding: 3, minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {/* Header */}
      <Typography variant="h4" align="center" gutterBottom>
        Product List
      </Typography>

      {/* Search Bar */}
      <Box sx={{ display: 'flex', gap: 2, marginBottom: 3, width: '100%', maxWidth: '800px' }}>
        <TextField
          fullWidth
          label="Search products"
          variant="outlined"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <Button variant="contained" onClick={handleSearch} sx={{ whiteSpace: 'nowrap' }}>
          Search
        </Button>
      </Box>

      {/* Product Table */}
      <Box sx={{ width: '100%', maxWidth: '800px', overflowX: 'auto', marginBottom: 3 }}>
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

      {/* Pagination */}
      <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
        <Pagination
          count={Math.ceil(total / pageSize)}
          page={page}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>

      {/* Buy Button */}
      <Box sx={{ marginTop: 3 }}>
        <Button variant="contained" color="success" onClick={handleOpenDialog}>
          Buy
        </Button>
      </Box>

      {/* Payment Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Choose Payment Method</DialogTitle>
        <DialogContent>
          <DialogContentText>Select your preferred payment method:</DialogContentText>
          <RadioGroup value={selectedPayment} onChange={handlePaymentChange}>
            <FormControlLabel value="online" control={<Radio />} label="Online Payment" />
            <FormControlLabel value="cash" control={<Radio />} label="Cash on Delivery" />
            <FormControlLabel value="credit" control={<Radio />} label="Credit Card" />
          </RadioGroup>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleBuy} variant="contained" color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProductList;