import db from '../models';

const Order = db.Order;

export const fetchAllOrders = async () => {
  return await Order.findAll({
    include: [
      { model: db.Customer },
      { model: db.Shipper },
      { model: db.OrderDetail },
    ],
  });
};

export const fetchOrderById = async (id: number) => {
  return await Order.findByPk(id, {
    include: [
      { model: db.Customer },
      { model: db.Shipper },
      { model: db.OrderDetail },
    ],
  });
};

export const createOrder = async (orderData: any) => {
  return await Order.create(orderData);
};

export const deleteOrderById = async (id: number) => {
  return await Order.destroy({ where: { id } });
};