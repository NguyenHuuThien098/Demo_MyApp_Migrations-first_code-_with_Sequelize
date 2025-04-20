import React, { useState, useEffect } from 'react';
import { Typography, Button, Snackbar, Alert, Paper, Avatar, Divider, Stack, Badge } from '@mui/material';
import Box from '@mui/material/Box';
import { useCart } from '../contexts/CartContext';
import { placeOrder } from '../services/orderService';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { useNavigate } from 'react-router-dom';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';

const CartPage: React.FC = () => {
  const { cartItems, removeFromCart, updateQuantity, markAsPurchased } = useCart();
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [selectedPayment, setSelectedPayment] = useState<string>('online');
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
  const navigate = useNavigate();
  const [showStickyTotal, setShowStickyTotal] = useState(false);

  // Filter items
  const unpurchasedItems = cartItems.filter(item => !item.isPurchased);

  // Calculate total
  const calculateTotal = () => {
    return unpurchasedItems.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
  };

  // Tính tổng số lượng sản phẩm
  const calculateTotalItems = () => {
    return unpurchasedItems.reduce((sum, item) => sum + item.quantity, 0);
  };

  // Handle scroll to show/hide sticky total - Giữ nguyên logic hiện tại
  useEffect(() => {
    setShowStickyTotal(false);

    const handleScroll = () => {
      setShowStickyTotal(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Dialog handlers
  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handlePaymentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedPayment(event.target.value);
  };

  // Place order
  const handleBuy = async () => {
    try {
      const orderData = {
        customerId: 1,
        shipperId: 1,
        paymentMethod: selectedPayment,
        orderDetails: unpurchasedItems.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
        })),
      };

      await placeOrder(orderData);
      markAsPurchased(unpurchasedItems.map(item => item.id));
      handleCloseDialog();

      setSnackbarMessage('Order placed successfully!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error placing order:', error);
      setSnackbarMessage('Failed to place order. Please try again.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const goToDashboard = () => navigate('/dashboard');

  return (
    <Box sx={{ padding: 0 }}>
      {/* Thanh tổng quan cố định ở đầu trang */}
      <Box sx={{
        position: 'sticky',
        top: 0,
        bgcolor: 'background.paper',
        boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
        zIndex: 10,
        borderBottom: '1px solid',
        borderColor: 'divider',
        px: 3,
        py: 2,
        mb: 2
      }}>
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Badge badgeContent={calculateTotalItems()} color="primary" sx={{ mr: 2 }}>
              <ShoppingBasketIcon color="action" />
            </Badge>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Your Shopping Cart
            </Typography>
          </Box>
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'primary.main' }}>
              ${calculateTotal().toFixed(2)}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              size="small"
              endIcon={<ArrowForwardIcon />}
              onClick={handleOpenDialog}
              sx={{ fontWeight: 'bold' }}
            >
              Checkout
            </Button>
          </Stack>
        </Box>
      </Box>

      <Box sx={{ padding: 3, pt: 0 }}>
        {unpurchasedItems.length === 0 && (
          <Paper elevation={2} sx={{ py: 8, px: 3, textAlign: 'center', borderRadius: 3 }}>
            <ShoppingCartIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h5" color="text.secondary" gutterBottom>
              Your cart is empty
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              Looks like you haven't added any products to your cart yet.
            </Typography>
            <Button
              variant="contained"
              onClick={goToDashboard}
              size="large"
              sx={{ px: 4, py: 1.5 }}
            >
              Start Shopping
            </Button>
          </Paper>
        )}

        {/* Sản phẩm chưa mua */}
        {unpurchasedItems.length > 0 && (
          <>
            <Box sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 2
            }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Items in Your Cart
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {unpurchasedItems.length} {unpurchasedItems.length === 1 ? 'item' : 'items'}
              </Typography>
            </Box>

            <Box sx={{ pb: 16 }}> {/* Add padding bottom for space when sticky footer appears */}
              {unpurchasedItems.map((item) => (
                <Paper
                  key={item.id}
                  elevation={1}
                  sx={{
                    mb: 2,
                    borderRadius: 2,
                    overflow: 'hidden',
                    transition: 'box-shadow 0.3s ease',
                    '&:hover': {
                      boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
                    {item.imageUrl ? (
                      <Avatar
                        src={item.imageUrl}
                        alt={item.name}
                        variant="rounded"
                        sx={{ width: 60, height: 60, mr: 2 }}
                      />
                    ) : (
                      <Avatar
                        variant="rounded"
                        sx={{ width: 60, height: 60, mr: 2, bgcolor: 'primary.main' }}
                      >
                        {item.name.charAt(0)}
                      </Avatar>
                    )}

                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                        {item.name}
                      </Typography>

                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                          ${item.unitPrice} x {item.quantity}
                        </Typography>
                        <Typography variant="subtitle2" color="primary.main" sx={{ fontWeight: 'bold' }}>
                          ${(item.unitPrice * item.quantity).toFixed(2)}
                        </Typography>
                      </Box>

                      {item.description && (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            mt: 1,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                          }}
                        >
                          {item.description}
                        </Typography>
                      )}
                    </Box>
                  </Box>

                  <Divider />

                  <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    backgroundColor: 'background.default',
                    p: 1
                  }}>
                    <IconButton
                      color="error"
                      onClick={() => removeFromCart(item.id)}
                      sx={{
                        '&:hover': {
                          backgroundColor: 'rgba(211, 47, 47, 0.04)'
                        }
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>

                    <Box sx={{
                      display: 'flex',
                      alignItems: 'center',
                      bgcolor: 'background.paper',
                      borderRadius: 1,
                      border: '1px solid',
                      borderColor: 'divider'
                    }}>
                      <IconButton
                        size="small"
                        onClick={() => {
                          if (item.quantity > 1) {
                            updateQuantity(item.id, item.quantity - 1);
                          } else {
                            removeFromCart(item.id);
                          }
                        }}
                        color="primary"
                      >
                        <RemoveIcon fontSize="small" />
                      </IconButton>
                      <Typography sx={{ mx: 2, fontWeight: 'bold', minWidth: '24px', textAlign: 'center' }}>
                        {item.quantity}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        color="primary"
                      >
                        <AddIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>
                </Paper>
              ))}
            </Box>

            {/* Sticky subtotal ở cuối trang - giữ nguyên tính năng khi cuộn */}
            <Box
              sx={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                zIndex: 1000,
                backgroundColor: '#1890ff',
                color: 'white',
                width: '100%',
                transition: 'transform 0.3s ease',
                transform: showStickyTotal ? 'translateY(0)' : 'translateY(100%)',
                boxShadow: '0px -4px 10px rgba(0,0,0,0.15)',
                maxWidth: { sm: `calc(100% - ${240}px)` },
                marginLeft: { sm: '240px' },
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', sm: 'row' },
                  justifyContent: 'space-between',
                  alignItems: { xs: 'stretch', sm: 'center' },
                  padding: 2,
                  maxWidth: 1200,
                  mx: 'auto',
                  gap: 2,
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: { xs: 'space-between', sm: 'flex-start' }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <ShoppingBagIcon sx={{ mr: 1, color: 'white' }} />
                    <Typography sx={{ fontWeight: 'bold', color: 'white' }}>
                      Subtotal ({calculateTotalItems()} items):
                    </Typography>
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'white', ml: 2 }}>
                    ${calculateTotal().toFixed(2)}
                  </Typography>
                </Box>

                <Button
                  variant="contained"
                  fullWidth={window.innerWidth < 600}
                  onClick={handleOpenDialog}
                  sx={{
                    py: 1.2,
                    px: 4,
                    fontWeight: 'bold',
                    backgroundColor: 'white',
                    color: '#1890ff',
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.9)',
                    },
                    textTransform: 'uppercase',
                    fontSize: '0.9rem',
                    letterSpacing: '1px',
                  }}
                >
                  CHECKOUT
                </Button>
              </Box>
            </Box>
          </>
        )}
      </Box>

      {/* Payment Method Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Choose Payment Method</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please select your preferred payment method:
          </DialogContentText>
          <RadioGroup
            value={selectedPayment}
            onChange={handlePaymentChange}
          >
            <FormControlLabel value="online" control={<Radio />} label="Online Payment" />
            <FormControlLabel value="cash" control={<Radio />} label="Cash on Delivery" />
            <FormControlLabel value="credit" control={<Radio />} label="Credit Card" />
          </RadioGroup>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleBuy} variant="contained" color="primary">
            Confirm Order
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CartPage;