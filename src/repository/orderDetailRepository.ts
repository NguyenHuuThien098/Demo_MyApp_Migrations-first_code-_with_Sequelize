import db from '../models';

const OrderDetail = db.OrderDetail;
const Order = db.Order;
const Product = db.Product;
const Customer = db.Customer;
const Shipper = db.Shipper;

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


export const fetchOrderDetailsByOrderId = async (orderId: number) => {
  return await OrderDetail.findAll({
    where: { OrderId: orderId }, // Lọc theo OrderId
    include: [
      {
        model: Order,
        attributes: ["OrderDate", "createdAt", "updatedAt"],
        include: [
          {
            model: Customer, // Lấy thông tin Customer từ Order
            attributes: ['id', 'Name', 'ContactName', 'Country'],
          },
          {
            model: Shipper,
            attributes: ['id', 'Name', 'shipper_code'],
          },
        ],
      },
      {
        model: Product, // Lấy thông tin Product từ OrderDetail
        attributes: ['id', 'Name', 'UnitPrice', 'quantity'],
      },
    ],
  });
};