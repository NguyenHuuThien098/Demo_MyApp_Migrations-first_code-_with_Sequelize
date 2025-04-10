import db from '../models';
import { QueryTypes } from 'sequelize'; // Import QueryTypes từ Sequelize

const sequelize = db.sequelize; // Lấy sequelize từ đối tượng db
const OrderDetail = db.OrderDetail;
const Order = db.Order;
const Product = db.Product;
const Customer = db.Customer;

export const fetchAllOrderDetails = async (limit: number, offset: number, searchText: string | null, order: string) => {
  
  const trimmedSearchText = searchText ? searchText.trim().replace(/\s+/g, ' ') : ''; 
  if(searchText === ' '|| searchText === null) {
    return new Error("Nhập từ khóa tìm kiếm");
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
    searchText: trimmedSearchText || ' ', // Thay thế null bằng chuỗi rỗng
    searchPattern: `%${trimmedSearchText || ' '}%`, // Thay thế null bằng chuỗi rỗng
  };

  const orderDetails = await sequelize.query(query, {
    type: QueryTypes.SELECT,
    replacements,
  });

  // Trả về dữ liệu và tổng số bản ghi
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
};


// export const fetchAllOrderDetails = async (limit: number, offset: number) => {
//   return await OrderDetail.findAndCountAll({
//       include: [
//           {
//               model: Product,
//               attributes: ['id', 'Name'], // Lấy thông tin sản phẩm
//           },
//           {
//               model: Customer, // Đảm bảo bao gồm mô hình Customer
//               attributes: ['Name'], // Lấy tên khách hàng
//           },
//       ],
//       limit, // Số lượng bản ghi mỗi trang
//       offset, // Vị trí bắt đầu
//   });
// };


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
        include: [
          {
            model: Customer, // Lấy thông tin Customer từ Order
            attributes: ['id', 'Name', 'ContactName', 'Country'],
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