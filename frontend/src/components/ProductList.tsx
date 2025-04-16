import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Button from '@mui/material/Button';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import Pagination from '@mui/material/Pagination';

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
  const [order, setOrder] = useState<string>('asc');

  const fetchProducts = async (nameProduct: string, page: number, pageSize: number, order: string) => {
    try {
      const response = await axios.get('http://localhost:8080/products/search', {
        params: {
          page,
          pageSize,
          nameProduct,
          order,
        },
      });
      setProducts(response.data.data);
      setTotal(response.data.total);
    } catch (err) {
      setError('Failed to fetch products');
    }
  };

  useEffect(() => {
    fetchProducts(searchText, page, pageSize, order);
  }, [searchText, page, pageSize, order]);

  const handleSearch = () => {
    setPage(1);
    fetchProducts(searchText, 1, pageSize, order);
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleOrderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setOrder(e.target.value);
  };

  if (error) return <p>{error}</p>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px' }}>
      <h1>Product List</h1>
      <div style={{ marginBottom: '20px', textAlign: 'center' }}>
        <input
          type="text"
          placeholder="Search products..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ padding: '10px', width: '300px', marginRight: '10px' }}
        />
        <Button variant="contained" onClick={handleSearch}>
          Search
        </Button>
        <select
          value={order}
          onChange={handleOrderChange}
          style={{ marginLeft: '10px', padding: '10px' }}
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>
      <table style={{ borderCollapse: 'collapse', width: '80%', textAlign: 'center' }}>
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
      <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}>
        <Pagination
          count={Math.ceil(total / pageSize)}
          page={page}
          onChange={handlePageChange}
          color="primary"
        />
      </div>
    </div>
  );
};

export default ProductList;