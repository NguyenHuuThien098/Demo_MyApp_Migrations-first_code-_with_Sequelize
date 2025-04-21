import React, { createContext, useState, useContext, ReactNode } from 'react';

/**
 * Cấu trúc dữ liệu sản phẩm sử dụng trong giỏ hàng
 */
interface Product {
  id: number;
  name: string;
  unitPrice: number;
  quantity: number; // Quantity in the cart
  stockQuantity?: number; // Total available stock quantity in the database
  description?: string;
  imageUrl?: string;
  isPurchased?: boolean;
  originalQuantity?: number; // Total original quantity from API
}

/**
 * Các phương thức và thuộc tính được cung cấp bởi CartContext
 * Định nghĩa giao diện công khai cho các component sử dụng context này
 */
interface CartContextType {
  cartItems: Product[];
  addToCart: (product: Product) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  markAsPurchased: (ids: number[]) => void;
  updateProductStock: (id: number, newStockQuantity: number) => void;
  getAvailableStock: (productId: number) => number;
}

// Tạo Context với giá trị mặc định
const CartContext = createContext<CartContextType | undefined>(undefined);

/**
 * Props cho CartProvider component
 */
interface CartProviderProps {
  children: ReactNode;
}

/**
 * Provider component cung cấp state và các phương thức quản lý giỏ hàng
 */
export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  // State lưu trữ sản phẩm trong giỏ hàng
  const [cartItems, setCartItems] = useState<Product[]>([]);

  /**
   * Tính toán số lượng còn lại có thể thêm vào giỏ hàng
   * @param productId - ID sản phẩm cần kiểm tra
   * @returns Số lượng còn lại có thể thêm vào giỏ
   */
  const getAvailableStock = (productId: number): number => {
    const item = cartItems.find(item => item.id === productId && !item.isPurchased);
    if (!item) return Number.MAX_SAFE_INTEGER;
    
    const totalStock = item.stockQuantity || item.originalQuantity || item.quantity;
    return Math.max(0, totalStock - item.quantity);
  };

  /**
   * Thêm sản phẩm vào giỏ hàng
   * Nếu sản phẩm đã tồn tại, tăng số lượng lên 1
   * Nếu chưa có, thêm mới với số lượng là 1
   * Kiểm tra số lượng tồn kho trước khi thêm
   */
  const addToCart = (product: Product) => {
    const existingItem = cartItems.find((item) => item.id === product.id && !item.isPurchased);
    
    // Lấy tổng số lượng tồn kho từ sản phẩm gốc
    // Ưu tiên lấy từ stockQuantity (nếu đã được thiết lập), rồi đến originalQuantity,
    // cuối cùng là quantity từ product truyền vào
    const totalStock = product.originalQuantity || product.stockQuantity || product.quantity;
    
    if (existingItem) {
      // Kiểm tra nếu đã đạt giới hạn tồn kho
      if (existingItem.quantity >= totalStock) {
        console.warn(`Cannot add more ${product.name}. Stock limit reached (${totalStock}).`);
        return;
      }
      
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.id === product.id && !item.isPurchased
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCartItems((prevItems) => [
        ...prevItems,
        { 
          ...product, 
          quantity: 1,
          originalQuantity: product.quantity, // Lưu lại số lượng gốc từ API
          stockQuantity: totalStock // Lưu trữ tổng số lượng tồn kho
        }
      ]);
    }
  };

  /**
   * Xóa sản phẩm khỏi giỏ hàng dựa vào id
   */
  const removeFromCart = (id: number) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  /**
   * Cập nhật số lượng của sản phẩm trong giỏ hàng
   * Đảm bảo số lượng không vượt quá tồn kho
   * @param id - ID của sản phẩm cần cập nhật
   * @param quantity - Số lượng mới
   */
  const updateQuantity = (id: number, quantity: number) => {
    setCartItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id !== id) return item;
        
        // Kiểm tra giới hạn tồn kho từ dữ liệu gốc
        const totalStock = item.originalQuantity || item.stockQuantity || item.quantity;
        const safeQuantity = Math.min(quantity, totalStock);
        
        return { ...item, quantity: safeQuantity };
      })
    );
  };

  /**
   * Xóa toàn bộ sản phẩm khỏi giỏ hàng
   */
  const clearCart = () => {
    setCartItems([]);
  };

  /**
   * Sử dụng sau khi đặt hàng thành công để phân biệt sản phẩm đã mua và chưa mua
   */
  const markAsPurchased = (ids: number[]) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        ids.includes(item.id) ? { ...item, isPurchased: true } : item
      )
    );
  };

  /**
   * Cập nhật số lượng tồn kho của sản phẩm
   * Sử dụng sau khi thêm sản phẩm vào giỏ hoặc khi có cập nhật từ server
   */
  const updateProductStock = (id: number, newStockQuantity: number) => {
    setCartItems((prevItems) =>
      prevItems.map((item) => 
        item.id === id ? { 
          ...item, 
          stockQuantity: newStockQuantity,
          originalQuantity: item.originalQuantity || newStockQuantity
        } : item
      )
    );
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        markAsPurchased,
        updateProductStock,
        getAvailableStock
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

/**
 * Hook tùy chỉnh để sử dụng CartContext
 * Đảm bảo context chỉ được sử dụng trong phạm vi của CartProvider
 * Ném ra lỗi nếu được sử dụng bên ngoài CartProvider
 */
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart phải được sử dụng trong CartProvider');
  }
  return context;
};