import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Cart item interface
export interface CartItem {
  id: number;
  name: string;
  unitPrice: number;
  quantity: number;
  stockQuantity: number;
  isPurchased?: boolean;
  imageUrl?: string;
  description?: string;
}

// Cart context interface
interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (itemId: number) => void;
  updateCartItemQuantity: (itemId: number, quantity: number) => void;
  updateQuantity: (itemId: number, quantity: number) => void; // Alias for updateCartItemQuantity
  markAsPurchased: (itemIds: number[]) => void; // Add method to mark items as purchased
  clearCart: () => void;
  getCartTotal: () => number;
  getCartItemCount: () => number;
}

// Create context
const CartContext = createContext<CartContextType | undefined>(undefined);

// Local storage key for cart
const CART_STORAGE_KEY = 'shopping_cart';

/**
 * Cart provider component
 * Manages cart state and provides functions for cart operations
 */
export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize state from local storage or empty array
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Save cart to local storage when it changes
  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  // Add item to cart or update quantity if already exists
  const addToCart = (item: CartItem) => {
    setCartItems(prevItems => {
      // Check if item already exists in cart
      const existingItemIndex = prevItems.findIndex(cartItem => cartItem.id === item.id);
      
      if (existingItemIndex !== -1) {
        // Update existing item quantity
        const updatedItems = [...prevItems];
        const newQuantity = updatedItems[existingItemIndex].quantity + item.quantity;
        
        // Ensure quantity doesn't exceed stock
        updatedItems[existingItemIndex].quantity = Math.min(newQuantity, item.stockQuantity);
        
        return updatedItems;
      } else {
        // Add new item to cart
        return [...prevItems, item];
      }
    });
  };

  // Remove item from cart by id
  const removeFromCart = (itemId: number) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
  };

  // Update quantity of an item in cart
  const updateCartItemQuantity = (itemId: number, quantity: number) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  };

  // Alias for updateCartItemQuantity
  const updateQuantity = (itemId: number, quantity: number) => {
    updateCartItemQuantity(itemId, quantity);
  };

  // Mark items as purchased
  const markAsPurchased = (itemIds: number[]) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        itemIds.includes(item.id) ? { ...item, isPurchased: true } : item
      )
    );
  };

  // Clear all items from cart
  const clearCart = () => {
    setCartItems([]);
  };

  // Calculate total price of cart
  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + item.quantity * item.unitPrice, 0);
  };

  // Count number of items in cart (not purchased)
  const getCartItemCount = () => {
    return cartItems
      .filter(item => !item.isPurchased)
      .reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateCartItemQuantity,
        updateQuantity,
        markAsPurchased,
        clearCart,
        getCartTotal,
        getCartItemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Custom hook for accessing cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};