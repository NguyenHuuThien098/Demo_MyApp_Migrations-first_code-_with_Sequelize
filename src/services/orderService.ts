import {fetchAllOrders,fetchOrderById,createOrder,deleteOrderById,} from '../repository/orderRepository';

export const getAllOrdersService = async () => {
    return await fetchAllOrders();
};

export const getOrderByIdService = async (id: number) => {
    return await fetchOrderById(id);
};

export const createOrderService = async (orderData: any) => {
    return await createOrder(orderData);
};

export const deleteOrderByIdService = async (id: number) => {
    return await deleteOrderById(id);
};