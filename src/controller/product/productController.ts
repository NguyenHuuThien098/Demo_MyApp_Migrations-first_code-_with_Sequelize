import { Request, Response } from 'express';
import { fetchAllProductsService, fetchProductByIdService,createProductService,deleteProductByIdService,updateProductByIdService } from '../../services/productService';

export const getProducts = async (_: Request, res: Response): Promise<void> => {
  try {
    const products = await fetchAllProductsService();
    res.json(products);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getProductById = async (req: Request, res: Response): Promise<void> => {
  try {
    const productId = Number(req.params.id);
    const product = await fetchProductByIdService(productId);

    if (!product) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    res.json(product);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await createProductService(req.body);
    res.status(201).json(product);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Xóa sản phẩm theo ID
export const deleteProductById = async (req: Request, res: Response): Promise<void> => {
  try {
    const productId = Number(req.params.id);
    const deleted = await deleteProductByIdService(productId);

    if (!deleted) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Sửa sản phẩm theo ID
export const updateProductById = async (req: Request, res: Response): Promise<void> => {
  try {
    const productId = Number(req.params.id);
    const [updatedCount, updatedProducts] = await updateProductByIdService(productId, req.body);

    if (updatedCount === 0) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    res.json(updatedProducts[0]); // Trả về sản phẩm đã được cập nhật
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};