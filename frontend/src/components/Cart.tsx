import React, { useState } from 'react';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import { placeOrder } from '../services/orderService';

interface CartProps {
    items: {
        id: number;
        name: string;
        unitPrice: number;
        quantity: number;
        isPurchased?: boolean; // Trạng thái đã mua
    }[];
    onRemoveItem: (id: number) => void;
    onBuy: (paymentMethod: string) => Promise<void>; // Thêm thuộc tính onBuy
}
const Cart: React.FC<CartProps> = ({ items, onRemoveItem }) => {
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [selectedPayment, setSelectedPayment] = useState<string>('online');
    const [purchasedItems, setPurchasedItems] = useState<number[]>([]); // Lưu trữ danh sách sản phẩm đã mua

    const calculateTotal = () =>
        items.reduce((total, item) => total + item.unitPrice * item.quantity, 0);

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
            const orderData = {
                customerId: 1, // ID khách hàng (có thể lấy từ auth)
                shipperId: 1, // ID đơn vị vận chuyển (có thể chọn từ UI)
                paymentMethod: selectedPayment,
                orderDetails: items.map((item) => ({
                    productId: item.id,
                    quantity: item.quantity,
                })),
            };
            const response = await placeOrder(orderData);
            console.log('Order placed successfully:', response);

            // Cập nhật trạng thái sản phẩm đã mua
            setPurchasedItems(items.map((item) => item.id));

            alert('Order placed successfully!');
            setOpenDialog(false); // Đóng dialog
        } catch (error) {
            console.error('Error placing order:', error);
            alert('Failed to place order.');
        }
    };

    return (
        <div
            style={{
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                justifyContent: 'flex-start',
                minHeight: '100vh',
            }}
        >
            {/* Header */}
            <Typography variant="h4" align="left" gutterBottom>
                Your Cart
            </Typography>

            {/* Cart Items */}
            <div style={{ width: '100%', maxWidth: '800px', marginBottom: '20px' }}>
                {items.length === 0 ? (
                    <Typography variant="h6" align="left">
                        Your cart is empty.
                    </Typography>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Price</th>
                                <th>Quantity</th>
                                <th>Total</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item) => (
                                <tr key={item.id}>
                                    <td>{item.name}</td>
                                    <td>${item.unitPrice}</td>
                                    <td>{item.quantity}</td>
                                    <td>${item.unitPrice * item.quantity}</td>
                                    <td>
                                        {purchasedItems.includes(item.id) ? (
                                            <span style={{ color: 'green', fontWeight: 'bold' }}>Purchased</span>
                                        ) : (
                                            <IconButton color="error" onClick={() => onRemoveItem(item.id)}>
                                                <DeleteIcon />
                                            </IconButton>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Total and Buy Button */}
            <div style={{ textAlign: 'left', marginTop: '20px' }}>
                <Typography variant="h6" gutterBottom>
                    Total: ${calculateTotal()}
                </Typography>
                <Button variant="contained" color="success" onClick={handleOpenDialog}>
                    Buy
                </Button>
            </div>

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
        </div>
    );
};

export default Cart;