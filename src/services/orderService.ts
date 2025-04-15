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
        return await this.orderRepository.createOrder(orderData);
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

    public async fetchDaysWithoutOrders() {
        return await this.orderRepository.fetchDaysWithoutOrders();
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
}