import { Request, Response } from 'express';
import { ProductService } from '../../services/productService';

export class ProductController {
  private productService: ProductService;

  constructor() {
    this.productService = new ProductService();
  }

  public async getProducts(_: Request, res: Response): Promise<void> {
    try {
      const products = await this.productService.fetchAllProducts();
      res.json(products);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  public async searchProducts(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      let pageSize = parseInt(req.query.pageSize as string) || 10;
  
      if (pageSize > 50) {
        pageSize = 50; // Giới hạn số lượng sản phẩm trên mỗi trang
      }
  
      const searchText = req.query.nameProduct as string || '';
  
      const result = await this.productService.searchProducts(page, pageSize, searchText);
  
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  public async getProductById(req: Request, res: Response): Promise<void> {
    try {
      const productId = Number(req.params.id);
      if (isNaN(productId)) {
        res.status(400).json({ error: 'Invalid product ID. It must be a number.' });
        return;
      }

      const product = await this.productService.fetchProductById(productId);
      if (!product) {
        res.status(404).json({ error: 'Product not found' });
        return;
      }

      res.json(product);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  public async createProduct(req: Request, res: Response): Promise<void> {
    try {
      const product = await this.productService.createProduct(req.body);
      res.status(201).json(product);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  public async deleteProductById(req: Request, res: Response): Promise<void> {
    try {
      const productId = Number(req.params.id);
      const deleted = await this.productService.deleteProductById(productId);

      if (!deleted) {
        res.status(404).json({ error: 'Product not found' });
        return;
      }

      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  public async updateProductById(req: Request, res: Response): Promise<void> {
    try {
      const productId = Number(req.params.id);
      const [updatedCount, updatedProducts] = await this.productService.updateProductById(productId, req.body);

      if (updatedCount === 0) {
        res.status(404).json({ error: 'Product not found' });
        return;
      }

      res.json(updatedProducts[0]);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  public async getTopProductsByQuarter(req: Request, res: Response): Promise<void> {
    try {
      const quarter = Number(req.query.quarter);
      if (isNaN(quarter) || quarter < 1 || quarter > 4) {
        res.status(400).json({ error: 'Invalid quarter. Please provide a value between 1 and 4.' });
        return;
      }

      const topProducts = await this.productService.fetchTopProductsByQuarter(quarter);
      res.json(topProducts);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  public async getProductsNeverOrdered(_: Request, res: Response): Promise<void> {
    try {
      const products = await this.productService.fetchProductsNeverOrdered();
      res.json(products);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

}