import { OrderDetailRepository } from '../repository/orderDetailRepository';
import { OrderDetailDto } from '../dto/orderDetail.dto';

export class OrderDetailService {
  private orderDetailRepository: OrderDetailRepository;

  constructor() {
    this.orderDetailRepository = new OrderDetailRepository();
  }

  public async fetchAllOrderDetails(page: number, pageSize: number, searchText: string | null, order: string) {
    if (pageSize > 10) {
      pageSize = 10;
    }

    const limit = pageSize;
    const offset = (page - 1) * pageSize;

    const result = await this.orderDetailRepository.fetchAllOrderDetails(limit, offset, searchText, order);

    const { rows, count } = result;

    const orderDetails = rows.map((detail: any) => new OrderDetailDto(detail));

    return {
      data: orderDetails,
      total: count,
      page,
      pageSize,
    };
  }

  public async fetchOrderDetailById(id: number) {
    const orderDetail = await this.orderDetailRepository.fetchOrderDetailById(id);
    return new OrderDetailDto(orderDetail);
  }

  public async createOrderDetail(orderDetailData: any) {
    return await this.orderDetailRepository.createOrderDetail(orderDetailData);
  }

  public async deleteOrderDetailById(id: number) {
    return await this.orderDetailRepository.deleteOrderDetailById(id);
  }

  public async fetchOrderDetailsByOrderId(orderId: number) {
    const orderDetails = await this.orderDetailRepository.fetchOrderDetailsByOrderId(orderId);
    return orderDetails.map((detail: any) => new OrderDetailDto(detail));
  }
}