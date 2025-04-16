import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Product {
  id: number;
  name: string;
  unitPrice: number;
  quantity: number;
}

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchText, setSearchText] = useState<string>(''); // State cho ô tìm kiếm
  const [page, setPage] = useState<number>(1); // State cho phân trang
  const [pageSize] = useState<number>(10); // Số sản phẩm trên mỗi trang
  const [total, setTotal] = useState<number>(0); // Tổng số sản phẩm
  const [order, setOrder] = useState<string>('asc'); // Thứ tự sắp xếp (asc/desc)

  // Hàm gọi API tìm kiếm sản phẩm
  const fetchProducts = async (nameProduct: string, page: number, pageSize: number, order: string) => {
    try {
    //   setLoading(true);
      const response = await axios.get('http://localhost:8080/products/search', {
        params: {
          page,
          pageSize,
          nameProduct,
          order,
        },
      });
      console.log('API Response:', response.data); // Kiểm tra dữ liệu trả về
      setProducts(response.data.data); // Dữ liệu sản phẩm
      setTotal(response.data.total); // Tổng số sản phẩm
    //   setLoading(false);
    } catch (err) {
      setError('Failed to fetch products');
    //   setLoading(false);
    }
  };

  // Gọi API khi page, searchText, pageSize, hoặc order thay đổi
  useEffect(() => {
    fetchProducts(searchText, page, pageSize, order);
  }, [searchText, page, pageSize, order]);

  // Xử lý khi người dùng nhấn nút Search
  const handleSearch = () => {
    setPage(1); // Reset về trang đầu tiên khi tìm kiếm
    fetchProducts(searchText, 1, pageSize, order);
  };

  // Xử lý khi chuyển trang
  const handleNextPage = () => {
    if (page * pageSize < total) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage((prevPage) => prevPage - 1);
    }
  };

  // Xử lý khi thay đổi thứ tự sắp xếp
  const handleOrderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setOrder(e.target.value);
  };

//   if (loading) return <p>Loading products...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Product List</h1>
      {/* Ô tìm kiếm, nút Search và sắp xếp */}
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Search products..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ padding: '10px', width: '300px', marginRight: '10px' }}
        />
        <button onClick={handleSearch} style={{ padding: '10px 20px', marginRight: '10px' }}>
          Search
        </button>
        {/* <select value={order} onChange={handleOrderChange} style={{ padding: '10px' }}>
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select> */}
      </div>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Unit Price</th>
            <th>Quantity</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(products) && products.length > 0 ? (
            products.map((product) => (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td>{product.name}</td>
                <td>${product.unitPrice}</td>
                <td>{product.quantity}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4}>No products found</td>
            </tr>
          )}
        </tbody>
      </table>
      {/* Phân trang */}
      <div style={{ marginTop: '20px' }}>
        <button onClick={handlePreviousPage} disabled={page === 1}>
          Previous
        </button>
        <span style={{ margin: '0 10px' }}>
          Page {page} of {Math.ceil(total / pageSize)}
        </span>
        <button onClick={handleNextPage} disabled={page * pageSize >= total}>
          Next
        </button>
      </div>
    </div>
  );
};

export default ProductList;