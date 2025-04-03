import db from '../models';

const Product = db.Product;

export const fetchAllProducts = async () => {
  return await Product.findAll(); 
};

export const fetchProductById = async (id: number) => {
  return await Product.findByPk(id);
};

export const createProduct = async (productData: any) => {
  return await Product.create(productData);
};

export const deleteProductById = async (id: number) => {
  return await Product.destroy({ where: { id } });
};

export const updateProductById = async (id: number, productData: any) => {
  return await Product.update(productData, { where: { id }, returning: true });
};