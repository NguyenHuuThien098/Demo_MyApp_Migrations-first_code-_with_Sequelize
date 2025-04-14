import {
    fetchAllOrders, fetchOrderById, createOrder, deleteOrderById,
    fetchOrdersByCustomerId,
    fetchOrdersWithCustomerInfo,
    fetchDaysWithoutOrders,
    fetchSecondHighestOrderDaysPerMonth,
    fetchCustomerRankingByYear,
} from '../repository/orderRepository';

// Lấy tất cả các đơn hàng
export const getAllOrdersService = async () => {
    return await fetchAllOrders(); // Gọi repository để lấy tất cả đơn hàng
};

// Lấy thông tin đơn hàng theo ID
export const getOrderByIdService = async (id: number) => {
    return await fetchOrderById(id); // Gọi repository để lấy đơn hàng theo ID
};

// Tạo đơn hàng mới
export const createOrderService = async (orderData: any) => {
    return await createOrder(orderData); // Gọi repository để tạo đơn hàng mới
};

// Xóa đơn hàng theo ID
export const deleteOrderByIdService = async (id: number) => {
    return await deleteOrderById(id); // Gọi repository để xóa đơn hàng theo ID
};

// Lấy tất cả các đơn hàng của một khách hàng dựa trên CustomerId
export const getOrdersByCustomerIdService = async (customerId: number) => {
    return await fetchOrdersByCustomerId(customerId); // Gọi repository để lấy đơn hàng của khách hàng
};

// Lấy thông tin đơn hàng bao gồm thông tin khách hàng
export const getOrdersWithCustomerInfoService = async () => {
    return await fetchOrdersWithCustomerInfo(); // Gọi repository để lấy dữ liệu từ DB
};

// Lấy danh sách các ngày trong tháng hiện tại mà không có đơn hàng nào được đặt
export const getDaysWithoutOrdersService = async () => {
    return await fetchDaysWithoutOrders(); // Gọi repository để lấy danh sách ngày không có đơn hàng
};

// Lấy danh sách các ngày mà số lượng đơn hàng là cao thứ hai trong mỗi tháng
export const getSecondHighestOrderDaysPerMonthService = async () => {
    return await fetchSecondHighestOrderDaysPerMonth(); // Gọi repository để lấy danh sách ngày có số lượng đơn hàng cao thứ hai
};

export const getCustomerRankingByYearService = async () => {
    return await fetchCustomerRankingByYear(); // Gọi repository để lấy dữ liệu
};