import { OrderRepository } from '../repository/orderRepository';

export class OrderService {
    private orderRepository: OrderRepository;

    constructor() {
        this.orderRepository = new OrderRepository();
    }

    public async fetchAllOrders() {
        return await this.orderRepository.fetchAllOrders();
    }

    public async fetchOrderById(id: number) {
        return await this.orderRepository.fetchOrderById(id);
    }

    public async createOrder(orderData: any) {
        const { customerId, shipperId, orderDetails } = orderData;
    
        // Kiểm tra tồn kho và lấy thông tin giá
        for (const detail of orderDetails) {
          const product = await this.orderRepository.fetchProductById(detail.productId);
          if (!product) {
            throw new Error(`Product with ID ${detail.productId} does not exist.`);
          }
          
          if (product.quantity < detail.quantity) {
            throw new Error(`Product ${product.Name} (ID: ${detail.productId}) does not have enough stock. Available: ${product.quantity}, Requested: ${detail.quantity}`);
          }
          
          // Lưu giá sản phẩm từ database để đảm bảo tính nhất quán
          detail.price = product.UnitPrice;
        }
    
        // Tạo đơn hàng
        const order = await this.orderRepository.createOrder({
          CustomerId: customerId,
          ShipperId: shipperId,
          OrderDate: new Date(),
        });
    
        // Tạo chi tiết đơn hàng và cập nhật tồn kho
        for (const detail of orderDetails) {
          await this.orderRepository.createOrderDetail({
            OrderId: order.id,
            ProductId: detail.productId,
            Quantity: detail.quantity,
            Price: detail.price,
          });
    
          // Cập nhật tồn kho
          await this.orderRepository.updateProductStock(detail.productId, -detail.quantity);
        }
    
        return order;
      }
    
    public async orderProductById(userId: number, productId: number, quantity: number) {
        // Kiểm tra sản phẩm tồn tại và số lượng tồn kho
        const product = await this.orderRepository.fetchProductById(productId);
        if (!product) {
          throw new Error('Product not found');
        }
    
        if (product.quantity < quantity) {
          throw new Error('Insufficient stock for the product');
        }
    
        // Tạo đơn hàng mới
        const order = await this.orderRepository.createOrder({
          CustomerId: userId, // Sử dụng userId làm CustomerId
          OrderDate: new Date(),
          ShipperId: null, // Có thể cập nhật sau nếu cần
        });
    
        // Tạo chi tiết đơn hàng
        await this.orderRepository.createOrderDetail({
          OrderId: order.id,
          ProductId: productId,
          Quantity: quantity,
          Price: product.UnitPrice,
        });
    
        // Cập nhật tồn kho sản phẩm
        await this.orderRepository.updateProductStock(productId, -quantity);
    
        return order;
      }

    public async deleteOrderById(id: number) {
        return await this.orderRepository.deleteOrderById(id);
    }

    public async fetchOrdersByCustomerId(customerId: number) {
        return await this.orderRepository.fetchOrdersByCustomerId(customerId);
    }

    public async fetchOrdersWithCustomerInfo() {
        return await this.orderRepository.fetchOrdersWithCustomerInfo();
    }

    public async fetchDaysWithoutOrdersForMonth(year: number, month: number) {
        return await this.orderRepository.fetchDaysWithoutOrdersForMonth(year, month);
    }

    public async fetchSecondHighestOrderDaysPerMonth() {
        return await this.orderRepository.fetchSecondHighestOrderDaysPerMonth();
    }

    public async fetchCustomerRankingByYear() {
        return await this.orderRepository.fetchCustomerRankingByYear();
    }

    public async fetchOrderDetails() {
        return await this.orderRepository.fetchOrderDetails();
    }

    public async fetchTotalAmountByCountry() {
        return await this.orderRepository.fetchTotalAmountByCountry();
    }

    public async fetchOrdersWithTotalAmountGreaterThan1000() {
        return await this.orderRepository.fetchOrdersWithTotalAmountGreaterThan1000();
    }

    public async fetchOrdersAboveAverage() {
        return await this.orderRepository.fetchOrdersAboveAverage();
    }

    public async searchOrders(page: number, pageSize: number, searchQuery: string, filters: any = {}) {
        const limit = pageSize;
        const offset = (page - 1) * pageSize;

        const result = await this.orderRepository.searchOrders(limit, offset, searchQuery, filters);

        return {
            data: result.rows,
            total: result.count,
            page,
            pageSize,
        };
    }
}