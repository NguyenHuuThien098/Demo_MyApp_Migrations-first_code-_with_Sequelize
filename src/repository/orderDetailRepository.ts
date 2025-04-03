import db from '../models';

const OrderDetail = db.OrderDetail;

export const fetchAllOrderDetails = async () => {
  return await OrderDetail.findAll({
    include: [
      { model: db.Order },
      { model: db.Product },
    ],
  });
};

export const fetchOrderDetailById = async (id: number) => {
  return await OrderDetail.findByPk(id, {
    include: [
      { model: db.Order },
      { model: db.Product },
    ],
  });
};

export const createOrderDetail = async (orderDetailData: any) => {
  return await OrderDetail.create(orderDetailData);
};

export const deleteOrderDetailById = async (id: number) => {
  return await OrderDetail.destroy({ where: { id } });
};