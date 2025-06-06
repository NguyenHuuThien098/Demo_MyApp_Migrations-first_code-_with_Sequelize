import db from '../models';
import { QueryTypes } from 'sequelize';

const sequelize = db.sequelize;
const OrderDetail = db.OrderDetail;
const Order = db.Order;
const Product = db.Product;

export class OrderDetailRepository {

  public async fetchAllOrderDetails(limit: number, offset: number, searchText: string | null, order: string) {
    const trimmedSearchText = searchText ? searchText.trim().replace(/\s+/g, ' ') : '';
    if (searchText === ' ' || searchText === null) {
      throw new Error('Nhập từ khóa tìm kiếm');
    }

    const query = `
      SELECT 
        od.id AS orderDetailId,
        od.OrderId AS orderId,
        od.ProductId AS productId,
        od.Quantity AS quantity,
        od.Price AS price,
        p.Name AS productName,
        c.id AS customerId,
        c.Name AS customerName,
        c.ContactName AS customerContactName,
        c.Country AS customerCountry
      FROM 
        OrderDetails od
      INNER JOIN 
        Products p ON od.ProductId = p.id
      INNER JOIN 
        Orders o ON od.OrderId = o.id
      INNER JOIN 
        Customers c ON o.CustomerId = c.id
      WHERE 
        (:searchText IS NULL OR p.Name LIKE :searchPattern)
      ORDER BY 
        p.Name ${order}
      LIMIT :limit OFFSET :offset;
    `;

    const replacements = {
      limit,
      offset,
      searchText: trimmedSearchText || ' ',
      searchPattern: `%${trimmedSearchText || ' '}%`,
    };

    const orderDetails = await sequelize.query(query, {
      type: QueryTypes.SELECT,
      replacements,
    });

    const countQuery = `
      SELECT COUNT(*) AS total
      FROM OrderDetails od
      INNER JOIN Products p ON od.ProductId = p.id
      INNER JOIN Orders o ON od.OrderId = o.id
      INNER JOIN Customers c ON o.CustomerId = c.id
      WHERE (:searchText IS NULL OR p.Name LIKE :searchPattern);
    `;

    const countResult = await sequelize.query(countQuery, {
      type: QueryTypes.SELECT,
      replacements,
    });

    const total = countResult[0]?.total || 0;

    return { rows: orderDetails, count: total };
  }

  public async fetchOrderDetailById(id: number) {
    return await OrderDetail.findByPk(id, {
      include: [
        { model: Order },
        { model: Product },
      ],
    });
  }

  public async createOrderDetail(orderDetailData: any) {
    return await OrderDetail.create(orderDetailData);
  }

  public async deleteOrderDetailById(id: number) {
    return await OrderDetail.destroy({ where: { id } });
  }

  public async fetchOrderDetailsByOrderId(orderId: number) {
  return await OrderDetail.findAll({
    attributes: [
      ['id', 'id'], // ID của OrderDetail
      ['OrderId', 'orderId'], // ID của Order
      ['ProductId', 'productId'], // ID của Product
      ['Quantity', 'quantity'], // Số lượng
      ['Price', 'price'], // Giá
      [db.sequelize.col('Product.Name'), 'productName'], // Tên sản phẩm
      [db.sequelize.col('Order.Customer.Name'), 'customerName'], // Tên khách hàng
    ],
    include: [
      {
        model: Order,
        attributes: [], // Không cần thêm các cột khác từ bảng Orders
        include: [
          {
            model: db.Customer,
            attributes: [], // Không cần thêm các cột khác từ bảng Customers
          },
        ],
      },
      {
        model: Product,
        attributes: [], // Không cần thêm các cột khác từ bảng Products
      },
    ],
    where: {
      OrderId: orderId, // Lọc theo OrderId
    },
    raw: true,
  });
}
}