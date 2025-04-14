import { Request, Response } from 'express';
import { fetchAllProductsService, fetchProductByIdService,createProductService,
  deleteProductByIdService,
  updateProductByIdService,
  fetchTopProductsInQ1Service,
  fetchTopProductsByQuarterService
} from '../../services/productService';

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

    // Kiểm tra nếu productId không phải là số hợp lệ
    if (isNaN(productId)) {
      res.status(400).json({ error: 'Invalid product ID. It must be a number.' });
      return;
    }

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

export const getTopProductsInQ1 = async (_: Request, res: Response): Promise<void> => {
  try {
    const topProducts = await fetchTopProductsInQ1Service(); // Gọi service để lấy dữ liệu
    res.json(topProducts); // Trả về danh sách sản phẩm
  } catch (error: any) {
    res.status(500).json({ error: error.message }); // Xử lý lỗi
  }
};

export const getTopProductsByQuarter = async (req: Request, res: Response): Promise<void> => {
  try {
    const quarter = Number(req.query.quarter); // Lấy giá trị quý từ query parameter

    // Kiểm tra nếu quarter không hợp lệ
    if (isNaN(quarter) || quarter < 1 || quarter > 4) {
      res.status(400).json({ error: 'Invalid quarter. Please provide a value between 1 and 4.' });
      return;
    }

    const topProducts = await fetchTopProductsByQuarterService(quarter); // Gọi service để lấy dữ liệu
    res.json(topProducts); // Trả về danh sách sản phẩm
  } catch (error: any) {
    console.error('Error fetching top products by quarter:', error);
    res.status(500).json({ error: error.message }); // Xử lý lỗi
  }
};