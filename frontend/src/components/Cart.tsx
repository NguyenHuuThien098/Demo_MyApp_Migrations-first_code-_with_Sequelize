import React, { useState, useEffect, useRef } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import Avatar from '@mui/material/Avatar';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import Badge from '@mui/material/Badge';

interface CartProps {
    items: {
        id: number;
        name: string;
        unitPrice: number;
        quantity: number;
        description?: string;
        imageUrl?: string;
        isPurchased?: boolean;
        stockQuantity?: number;
    }[];
    onRemoveItem: (id: number) => void;
    onUpdateQuantity: (id: number, quantity: number) => void;
    onBuy: (paymentMethod: string) => Promise<void>;
}

const Cart: React.FC<CartProps> = ({
    items,
    onRemoveItem,
    onUpdateQuantity,
    onBuy
}) => {
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [selectedPayment, setSelectedPayment] = useState<string>('online');
    const [showStickyTotal, setShowStickyTotal] = useState(false);
    const contentRef = useRef<HTMLDivElement>(null);

    const unpurchasedItems = items.filter(item => !item.isPurchased);

    // Calculate total
    const calculateTotal = () => {
        return unpurchasedItems.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
    };
  
    // Tính tổng số lượng sản phẩm
    const calculateTotalItems = () => {
        return unpurchasedItems.reduce((sum, item) => sum + item.quantity, 0);
    };

    // Handle scroll to show/hide sticky total
    useEffect(() => {
        const handleScroll = (e: any) => {
            setShowStickyTotal(e.target.scrollTop > 200);
        };

        const drawerElement = contentRef.current?.closest('.MuiDrawer-paper');
        if (drawerElement) {
            drawerElement.addEventListener('scroll', handleScroll);
            return () => {
                drawerElement.removeEventListener('scroll', handleScroll);
            };
        }

        return () => { };
    }, []);

    const handleOpenDialog = () => {
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handlePaymentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedPayment(event.target.value);
    };

    const handleBuy = async () => {
        try {
            await onBuy(selectedPayment);
            handleCloseDialog();
        } catch (error) {
            console.error('Error during purchase', error);
        }
    };

    const handleIncreaseQuantity = (item: any) => {
        const maxQuantity = item.stockQuantity || Number.MAX_SAFE_INTEGER;
        if (item.quantity < maxQuantity) {
            onUpdateQuantity(item.id, item.quantity + 1);
        }
    };

    const handleDecreaseQuantity = (item: any) => {
        if (item.quantity > 1) {
            onUpdateQuantity(item.id, item.quantity - 1);
        } else {
            onRemoveItem(item.id);
        }
    };

    return (
        <Box sx={{ width: '100%', position: 'relative', pb: 15 }} ref={contentRef}>
            {/* Header cố định */}
            <Box sx={{ 
                position: 'sticky',
                top: 0,
                bgcolor: 'background.paper',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                zIndex: 10,
                p: 2,
                mb: 2,
                borderRadius: 1
            }}>
                <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center'
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Badge badgeContent={calculateTotalItems()} color="primary" sx={{ mr: 1.5 }}>
                            <ShoppingCartIcon fontSize="small" />
                        </Badge>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                            Cart Summary
                        </Typography>
                    </Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'primary.main' }}>
                        ${calculateTotal().toFixed(2)}
                    </Typography>
                </Box>
            </Box>

            {items.length === 0 ? (
                <Box sx={{
                    py: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <Avatar sx={{
                        width: 64,
                        height: 64,
                        bgcolor: 'primary.light',
                        mb: 2
                    }}>
                        <ShoppingCartIcon fontSize="large" />
                    </Avatar>
                    <Typography variant="body1" color="text.secondary" align="center">
                        Your cart is empty.
                    </Typography>
                </Box>
            ) : (
                <>
                    {unpurchasedItems.length > 0 && (
                        <>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                                {unpurchasedItems.length} {unpurchasedItems.length === 1 ? 'item' : 'items'} in cart
                            </Typography>

                            {unpurchasedItems.map((item) => (
                                <Paper
                                    key={item.id}
                                    elevation={0}
                                    sx={{
                                        mb: 2,
                                        borderRadius: 2,
                                        overflow: 'hidden',
                                        border: '1px solid',
                                        borderColor: 'divider',
                                        '&:hover': {
                                            borderColor: 'primary.light'
                                        }
                                    }}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'center', p: 1.5 }}>
                                        {item.imageUrl ? (
                                            <Avatar
                                                src={item.imageUrl}
                                                alt={item.name}
                                                variant="rounded"
                                                sx={{ width: 50, height: 50, mr: 1.5 }}
                                            />
                                        ) : (
                                            <Avatar
                                                variant="rounded"
                                                sx={{ width: 50, height: 50, mr: 1.5, bgcolor: 'primary.main' }}
                                            >
                                                {item.name.charAt(0)}
                                            </Avatar>
                                        )}

                                        <Box sx={{ flexGrow: 1 }}>
                                            <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                                                {item.name}
                                            </Typography>

                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 0.5 }}>
                                                <Typography variant="caption" color="text.secondary">
                                                    ${item.unitPrice} x {item.quantity}
                                                </Typography>
                                                <Typography variant="body2" color="primary.main" sx={{ fontWeight: 'bold' }}>
                                                    ${(item.unitPrice * item.quantity).toFixed(2)}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Box>

                                    <Divider />

                                    <Box sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        backgroundColor: 'background.default',
                                        p: 0.75
                                    }}>
                                        <IconButton
                                            size="small"
                                            color="error"
                                            onClick={() => onRemoveItem(item.id)}
                                            sx={{
                                                '&:hover': {
                                                    backgroundColor: 'rgba(211, 47, 47, 0.04)'
                                                }
                                            }}
                                        >
                                            <DeleteIcon fontSize="small" />
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
                                                onClick={() => handleDecreaseQuantity(item)}
                                                color="primary"
                                            >
                                                <RemoveIcon fontSize="small" />
                                            </IconButton>
                                            <Typography sx={{ mx: 1.5, fontWeight: 'bold', fontSize: '0.75rem', minWidth: '18px', textAlign: 'center' }}>
                                                {item.quantity}
                                            </Typography>
                                            <IconButton
                                                size="small"
                                                onClick={() => handleIncreaseQuantity(item)}
                                                color="primary"
                                                disabled={item.stockQuantity !== undefined && item.quantity >= item.stockQuantity}
                                            >
                                                <AddIcon fontSize="small" />
                                            </IconButton>
                                        </Box>
                                    </Box>
                                </Paper>
                            ))}

                            {/* Normal subtotal section - đã loại bỏ CardContent */}
                            <Box
                                id="drawer-subtotal-section"
                                sx={{
                                    mt: 2,
                                    mb: 3,
                                    borderRadius: 2,
                                    background: 'linear-gradient(135deg, #2196f3 0%, #1976d2 100%)',
                                    color: 'white',
                                    border: '1px solid',
                                    borderColor: 'primary.dark',
                                    padding: 2,
                                    boxShadow: 2
                                }}
                            >
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <ShoppingBagIcon sx={{ mr: 1, fontSize: 'small' }} />
                                        <Typography variant="body2" sx={{ color: 'white' }}>
                                            Subtotal ({calculateTotalItems()} items):
                                        </Typography>
                                    </Box>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: 'white' }}>
                                        ${calculateTotal().toFixed(2)}
                                    </Typography>
                                </Box>
                                <Button
                                    variant="contained"
                                    size="small"
                                    fullWidth
                                    onClick={handleOpenDialog}
                                    sx={{
                                        mt: 1.5,
                                        py: 0.75,
                                        fontWeight: 'bold',
                                        bgcolor: 'white',
                                        color: 'primary.main',
                                        '&:hover': {
                                            bgcolor: 'rgba(255,255,255,0.9)',
                                        },
                                        textTransform: 'uppercase',
                                        fontSize: '0.7rem',
                                    }}
                                >
                                    CHECKOUT
                                </Button>
                            </Box>

                            {/* Sticky subtotal */}
                            <Box
                                sx={{
                                    position: 'fixed',
                                    bottom: 0,
                                    zIndex: 1000,
                                    width: 'inherit', // Match drawer width
                                    backgroundColor: '#1890ff',
                                    color: 'white',
                                    transition: 'transform 0.3s ease',
                                    transform: showStickyTotal ? 'translateY(0)' : 'translateY(100%)',
                                    boxShadow: '0px -4px 10px rgba(0,0,0,0.15)',
                                }}
                            >
                                <Box
                                    sx={{
                                        padding: 1.5,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: 1,
                                    }}
                                >
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <ShoppingBagIcon sx={{ mr: 1, fontSize: 'small' }} />
                                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                                Subtotal ({calculateTotalItems()} items):
                                            </Typography>
                                        </Box>
                                        <Typography sx={{ fontWeight: 'bold' }}>
                                            ${calculateTotal().toFixed(2)}
                                        </Typography>
                                    </Box>

                                    <Button
                                        variant="contained"
                                        fullWidth
                                        onClick={handleOpenDialog}
                                        sx={{
                                            py: 0.75,
                                            fontWeight: 'bold',
                                            backgroundColor: 'white',
                                            color: '#1890ff',
                                            '&:hover': {
                                                backgroundColor: 'rgba(255,255,255,0.9)',
                                            },
                                            textTransform: 'uppercase',
                                            fontSize: '0.7rem',
                                        }}
                                    >
                                        PROCEED TO CHECKOUT
                                    </Button>
                                </Box>
                            </Box>
                        </>
                    )}
                </>
            )}

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
        </Box>
    );
};

export default Cart;