import React, { useState, useEffect } from 'react';
import { Typography, Button, Snackbar, Alert, Paper, Avatar, Divider, Stack, Badge, useMediaQuery } from '@mui/material';
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
import { useTheme } from '@mui/material/styles';

const CartPage: React.FC = () => {
  const { cartItems, removeFromCart, updateQuantity, markAsPurchased } = useCart();
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [selectedPayment, setSelectedPayment] = useState<string>('online');
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
  const navigate = useNavigate();
  const [showStickyTotal, setShowStickyTotal] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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
      setShowStickyTotal(window.scrollY > 150);
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
    <Box sx={{ padding: { xs: 1, sm: 2, md: 3 } }}>
      {/* Thanh tổng quan cố định ở đầu trang */}
      <Box sx={{ 
        position: 'sticky',
        top: 0,
        bgcolor: 'background.paper',
        boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
        zIndex: 10,
        borderBottom: '1px solid',
        borderColor: 'divider',
        px: { xs: 2, sm: 3 },
        py: 2,
        mb: 2
      }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          flexWrap: { xs: 'wrap', sm: 'nowrap' },
          gap: { xs: 1, sm: 0 }
        }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center',
            width: { xs: '100%', sm: 'auto' }
          }}>
            <Badge badgeContent={calculateTotalItems()} color="primary" sx={{ mr: 2 }}>
              <ShoppingBasketIcon color="action" />
            </Badge>
            <Typography variant="h6" sx={{ fontWeight: 600, fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
              Your Shopping Cart
            </Typography>
          </Box>
          <Stack 
            direction="row" 
            spacing={1} 
            alignItems="center"
            sx={{ 
              width: { xs: '100%', sm: 'auto' },
              justifyContent: { xs: 'flex-end', sm: 'flex-start' },
              mt: { xs: 1, sm: 0 }
            }}
          >
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

      <Box sx={{ padding: { xs: 1, sm: 2, md: 3 }, pt: 0 }}>
        {unpurchasedItems.length === 0 && (
          <Paper elevation={2} sx={{ py: { xs: 6, sm: 8 }, px: { xs: 2, sm: 3 }, textAlign: 'center', borderRadius: 3 }}>
            <ShoppingCartIcon sx={{ fontSize: { xs: 60, sm: 80 }, color: 'text.secondary', mb: 2 }} />
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
              <Typography variant="h6" sx={{ fontWeight: 600, fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                Items in Your Cart
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {unpurchasedItems.length} {unpurchasedItems.length === 1 ? 'item' : 'items'}
              </Typography>
            </Box>

            <Box sx={{ pb: { xs: 12, sm: 16 } }}> {/* Add padding bottom for space when sticky footer appears */}
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
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    p: { xs: 1.5, sm: 2 },
                    flexWrap: { xs: 'wrap', sm: 'nowrap' },
                    gap: { xs: 1, sm: 0 }
                  }}>
                    {item.imageUrl ? (
                      <Avatar
                        src={item.imageUrl}
                        alt={item.name}
                        variant="rounded"
                        sx={{ 
                          width: { xs: 50, sm: 60 }, 
                          height: { xs: 50, sm: 60 }, 
                          mr: { xs: 1, sm: 2 },
                          flexShrink: 0
                        }}
                      />
                    ) : (
                      <Avatar
                        variant="rounded"
                        sx={{ 
                          width: { xs: 50, sm: 60 }, 
                          height: { xs: 50, sm: 60 }, 
                          mr: { xs: 1, sm: 2 },
                          bgcolor: 'primary.main',
                          flexShrink: 0
                        }}
                      >
                        {item.name.charAt(0)}
                      </Avatar>
                    )}

                    <Box sx={{ flexGrow: 1, width: { xs: '100%', sm: 'auto' } }}>
                      <Typography variant="subtitle1" sx={{ 
                        fontWeight: 'bold',
                        fontSize: { xs: '0.9rem', sm: '1rem' },
                        mt: { xs: 1, sm: 0 }
                      }}>
                        {item.name}
                      </Typography>

                      <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center', 
                        mt: 1 
                      }}>
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                          ${item.unitPrice} x {item.quantity}
                        </Typography>
                        <Typography 
                          variant="subtitle2" 
                          color="primary.main" 
                          sx={{ 
                            fontWeight: 'bold',
                            fontSize: { xs: '0.8rem', sm: '0.875rem' } 
                          }}
                        >
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
                            fontSize: { xs: '0.75rem', sm: '0.875rem' }
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
                    p: { xs: 0.75, sm: 1 }
                  }}>
                    <IconButton
                      color="error"
                      onClick={() => removeFromCart(item.id)}
                      size={isMobile ? "small" : "medium"}
                      sx={{
                        '&:hover': {
                          backgroundColor: 'rgba(211, 47, 47, 0.04)'
                        }
                      }}
                    >
                      <DeleteIcon fontSize={isMobile ? "small" : "medium"} />
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
                        size={isMobile ? "small" : "medium"}
                        onClick={() => {
                          if (item.quantity > 1) {
                            updateQuantity(item.id, item.quantity - 1);
                          } else {
                            removeFromCart(item.id);
                          }
                        }}
                        color="primary"
                      >
                        <RemoveIcon fontSize={isMobile ? "small" : "medium"} />
                      </IconButton>
                      <Typography sx={{ 
                        mx: { xs: 1, sm: 2 }, 
                        fontWeight: 'bold', 
                        minWidth: '24px', 
                        textAlign: 'center',
                        fontSize: { xs: '0.8rem', sm: '1rem' }
                      }}>
                        {item.quantity}
                      </Typography>
                      <IconButton
                        size={isMobile ? "small" : "medium"}
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        color="primary"
                      >
                        <AddIcon fontSize={isMobile ? "small" : "medium"} />
                      </IconButton>
                    </Box>
                  </Box>
                </Paper>
              ))}
            </Box>

            {/* Subtotal section - đã loại bỏ CardContent */}
            <Box 
              id="subtotal-section"
              sx={{
                mt: 3,
                mb: 4,
                borderRadius: 2,
                background: 'linear-gradient(135deg, #2196f3 0%, #1976d2 100%)',
                color: 'white',
                position: 'relative',
                zIndex: 1,
                padding: { xs: 2, sm: 3 },
                boxShadow: 3
              }}
            >
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: { xs: 1, sm: 0 }
              }}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  width: { xs: '100%', sm: 'auto' }
                }}>
                  <ShoppingBagIcon sx={{ mr: 1 }} />
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      color: 'white',
                      fontSize: { xs: '1rem', sm: '1.25rem' }
                    }}
                  >
                    Subtotal ({calculateTotalItems()} items):
                  </Typography>
                </Box>
                <Typography 
                  variant="h5" 
                  sx={{ 
                    fontWeight: 'bold', 
                    color: 'white',
                    fontSize: { xs: '1.25rem', sm: '1.5rem' }
                  }}
                >
                  ${calculateTotal().toFixed(2)}
                </Typography>
              </Box>
              <Button
                variant="contained"
                size="large"
                fullWidth
                onClick={handleOpenDialog}
                sx={{
                  mt: 2,
                  py: { xs: 1, sm: 1.5 },
                  fontWeight: 'bold',
                  bgcolor: 'white',
                  color: 'primary.main',
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.9)',
                  },
                  textTransform: 'uppercase',
                  fontSize: { xs: '0.8rem', sm: '0.875rem' }
                }}
              >
                PROCEED TO CHECKOUT
              </Button>
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
                  padding: { xs: 1.5, sm: 2 },
                  maxWidth: 1200,
                  mx: 'auto',
                  gap: { xs: 1, sm: 2 }
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
                    <ShoppingBagIcon sx={{ mr: 1, color: 'white', fontSize: { xs: '1rem', sm: '1.25rem' } }} />
                    <Typography sx={{ 
                      fontWeight: 'bold', 
                      color: 'white',
                      fontSize: { xs: '0.8rem', sm: '1rem' }
                    }}>
                      Subtotal ({calculateTotalItems()} items):
                    </Typography>
                  </Box>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: 'bold', 
                      color: 'white', 
                      ml: 2,
                      fontSize: { xs: '1rem', sm: '1.25rem' } 
                    }}
                  >
                    ${calculateTotal().toFixed(2)}
                  </Typography>
                </Box>

                <Button
                  variant="contained"
                  fullWidth={isMobile}
                  onClick={handleOpenDialog}
                  sx={{
                    py: { xs: 0.75, sm: 1.2 },
                    px: { xs: 2, sm: 4 },
                    fontWeight: 'bold',
                    backgroundColor: 'white',
                    color: '#1890ff',
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.9)',
                    },
                    textTransform: 'uppercase',
                    fontSize: { xs: '0.75rem', sm: '0.9rem' },
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
      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog}
        fullScreen={isMobile}
      >
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
        anchorOrigin={{ 
          vertical: isMobile ? 'top' : 'bottom', 
          horizontal: 'right' 
        }}
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