import {
    fetchAllOrderDetails,
    fetchOrderDetailById,
    createOrderDetail,
    deleteOrderDetailById,
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