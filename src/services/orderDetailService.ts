import {
  fetchAllOrderDetails,
  fetchOrderDetailById,
  createOrderDetail,
  deleteOrderDetailById,
  fetchOrderDetailsByOrderId
} from '../repository/orderDetailRepository';

import { OrderDetailDto } from '../dto/orderDetail.dto';

export const getAllOrderDetailsService = async (
  page: number,
  pageSize: number,
  searchText: string | null,
  order: string
) => {
  // Giới hạn pageSize không vượt quá 10
  if (pageSize > 10) {
    pageSize = 10;
  }

  const limit = pageSize;
  const offset = (page - 1) * pageSize;

  const result = await fetchAllOrderDetails(limit, offset, searchText, order);

  // Kiểm tra nếu kết quả là lỗi
  if (result instanceof Error) {
    throw result; // Ném lỗi để controller xử lý
  }

  const { rows, count } = result;

  // Chuyển đổi dữ liệu sang DTO
  const orderDetails = rows.map((detail: any) => new OrderDetailDto(detail));

  return {
    data: orderDetails,
    total: count,
    page,
    pageSize,
  };
};

export const getOrderDetailByIdService = async (id: number) => {

  const orderDetail = await fetchOrderDetailById(id);
  return new OrderDetailDto(orderDetail);
};

export const createOrderDetailService = async (orderDetailData: any) => {
  return await createOrderDetail(orderDetailData);
};

export const deleteOrderDetailByIdService = async (id: number) => {
  return await deleteOrderDetailById(id);
};

export const fetchOrderDetailsByOrderIdService = async (orderId: number) => {
  const orderDetails = await fetchOrderDetailsByOrderId(orderId);

  // Chuyển đổi dữ liệu từ cơ sở dữ liệu sang DTO
  return orderDetails.map((detail: any) => new OrderDetailDto(detail));
  // return await fetchOrderDetailsByOrderId(orderId);
};