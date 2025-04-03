import {
    fetchAllOrderDetails,
    fetchOrderDetailById,
    createOrderDetail,
    deleteOrderDetailById,
    fetchOrderDetailsByOrderId
} from '../repository/orderDetailRepository';

export const getAllOrderDetailsService = async () => {
    return await fetchAllOrderDetails();
};

export const getOrderDetailByIdService = async (id: number) => {
    return await fetchOrderDetailById(id);
};

export const createOrderDetailService = async (orderDetailData: any) => {
    return await createOrderDetail(orderDetailData);
};

export const deleteOrderDetailByIdService = async (id: number) => {
    return await deleteOrderDetailById(id);
};

export const fetchOrderDetailsByOrderIdService = async (orderId: number) => {
    return await fetchOrderDetailsByOrderId(orderId);
};