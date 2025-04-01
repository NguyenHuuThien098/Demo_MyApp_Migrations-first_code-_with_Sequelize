import db from '../models';

const Product = db.Product;

export const fetchAllProducts = async () => {
  return await Product.findAll(); // Lấy tất cả các sản phẩm
};