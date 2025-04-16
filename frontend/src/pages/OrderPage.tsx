import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Product {
  id: number;
  name: string;
  unitPrice: number;
}

const OrderPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<{ [key: number]: number }>({}); // Lưu số lượng sản phẩm được chọn

  // Lấy danh sách sản phẩm từ API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:8080/products'); // URL API backend
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  // Xử lý khi thay đổi số lượng sản phẩm
  const handleQuantityChange = (productId: number, quantity: number) => {
    setSelectedProducts((prev) => ({
      ...prev,
      [productId]: quantity,
    }));
  };

  // Xử lý khi nhấn nút đặt hàng
  const handlePlaceOrder = () => {
    const orderDetails = Object.entries(selectedProducts)
      .filter(([_, quantity]) => quantity > 0)
      .map(([productId, quantity]) => ({
        productId: Number(productId),
        quantity,
      }));

    console.log('Order Details:', orderDetails);

    // Gửi dữ liệu đặt hàng lên backend (nếu cần)
    axios
      .post('http://localhost:8080/orders', { orderDetails })
      .then((response) => console.log('Order placed successfully:', response.data))
      .catch((error) => console.error('Error placing order:', error));
  };

  return (
    <div>
      <h1>Place Your Order</h1>
      <table>
        <thead>
          <tr>
            <th>Product Name</th>
            <th>Unit Price</th>
            <th>Quantity</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.name}</td>
              <td>${product.unitPrice}</td>
              <td>
                <input
                  type="number"
                  min="0"
                  value={selectedProducts[product.id] || 0}
                  onChange={(e) =>
                    handleQuantityChange(product.id, Number(e.target.value))
                  }
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={handlePlaceOrder}>Place Order</button>
    </div>
  );
};

export default OrderPage;