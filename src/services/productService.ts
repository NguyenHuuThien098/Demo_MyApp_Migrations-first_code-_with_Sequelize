import { ProductRepository } from '../repository/productRepository';

export class ProductService {
  private productRepository: ProductRepository;

  constructor() {
    this.productRepository = new ProductRepository();
  }

  public async fetchAllProducts() {
    return await this.productRepository.fetchAllProducts();
  }

  public async fetchProductById(id: number) {
    return await this.productRepository.fetchProductById(id);
  }

  public async createProduct(productData: any) {
    return await this.productRepository.createProduct(productData);
  }

  public async deleteProductById(id: number) {
    return await this.productRepository.deleteProductById(id);
  }

  public async updateProductById(id: number, productData: any) {
    return await this.productRepository.updateProductById(id, productData);
  }

  public async fetchTopProductsByQuarter(quarter: number) {
    const startMonth = (quarter - 1) * 3 + 1;
    const endMonth = startMonth + 2;
    return await this.productRepository.fetchTopProductsByQuarter(startMonth, endMonth);
  }


  public async fetchProductsNeverOrdered() {
    return await this.productRepository.fetchProductsNeverOrdered();
  }
}