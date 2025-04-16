import React from 'react';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

interface CartItem {
  id: number;
  name: string;
  unitPrice: number;
  quantity: number;
}

interface CartProps {
  items: CartItem[];
  onRemoveItem: (id: number) => void;
  onBuy: () => void;
}

const Cart: React.FC<CartProps> = ({ items, onRemoveItem, onBuy }) => {
  const calculateTotal = () =>
    items.reduce((total, item) => total + item.unitPrice * item.quantity, 0);

  return (
    <div>
      <h2>
        <ShoppingCartIcon style={{ marginRight: '10px' }} />
        Your Cart
      </h2>
      {items.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <table>
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
                  <IconButton
                    color="error"
                    onClick={() => onRemoveItem(item.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <h3>Total: ${calculateTotal()}</h3>
      <Button
        variant="contained"
        color="success"
        startIcon={<CheckCircleIcon />}
        onClick={onBuy}
      >
        Buy
      </Button>
    </div>
  );
};

export default Cart;