import db from '../models';
import { QueryTypes } from 'sequelize';
import { Op } from 'sequelize';


const sequelize = db.sequelize;
const Order = db.Order;
const Customer = db.Customer;
const OrderDetail = db.OrderDetail;
const Shipper = db.Shipper;



export class OrderRepository {
  public async fetchAllOrders() {
    return await Order.findAll({
      include: [
        { model: db.Customer },
        { model: db.Shipper },
        { model: db.OrderDetail },
      ],
    });
  }

  public async fetchOrderById(id: number) {
    return await Order.findByPk(id, {
      include: [
        { model: db.Customer },
        { model: db.Shipper },
        { model: db.OrderDetail },
      ],
    });
  }

  public async createOrder(orderData: any) {
    return await Order.create(orderData);
  }

  public async deleteOrderById(id: number) {
    return await Order.destroy({ where: { id } });
  }

  public async fetchOrdersByCustomerId(customerId: number) {
    return await Order.findAll({
      where: { CustomerId: customerId },
      include: [
        { model: db.Customer, attributes: ['id', 'name', 'contactName', 'country'] },
        { model: db.Shipper, attributes: ['id', 'Name', 'shipper_code'] },
        { model: db.OrderDetail, include: [{ model: db.Product, attributes: ['id', 'Name', 'UnitPrice'] }] },
      ],
    });
  }

  public async fetchOrdersWithCustomerInfo() {
    return await Order.findAll({
      attributes: [
        ['id', 'orderId'], // ID của đơn hàng
        'OrderDate', // Ngày đặt hàng
        [db.sequelize.col('Customer.id'), 'customerId'], // ID khách hàng
        [db.sequelize.col('Customer.Name'), 'customerName'], // Tên khách hàng
        [db.sequelize.col('Customer.ContactName'), 'customerContactName'], // Tên liên hệ khách hàng
        [db.sequelize.col('Customer.Country'), 'customerCountry'], // Quốc gia khách hàng
        [db.sequelize.col('OrderDetails.id'), 'orderDetailId'], // ID chi tiết đơn hàng
        [db.sequelize.col('OrderDetails.ProductId'), 'productId'], // ID sản phẩm
        [db.sequelize.col('OrderDetails.Quantity'), 'quantity'], // Số lượng sản phẩm
        [db.sequelize.col('OrderDetails.Price'), 'price'], // Giá sản phẩm
        [db.sequelize.col('OrderDetails.Product.Name'), 'productName'], // Tên sản phẩm
        [db.sequelize.col('OrderDetails.Product.UnitPrice'), 'productUnitPrice'], // Giá đơn vị sản phẩm
      ],
      include: [
        {
          model: Customer,
          attributes: [], // Không cần thêm các cột khác từ bảng Customer
        },
        {
          model: OrderDetail,
          attributes: [], // Không cần thêm các cột khác từ bảng OrderDetail
          include: [
            {
              model: db.Product,
              attributes: [], // Không cần thêm các cột khác từ bảng Product
            },
          ],
        },
      ],
    });
  }


  public async fetchDaysWithoutOrdersForMonth(year: number, month: number) {
    // Tạo danh sách tất cả các ngày trong tháng
    const daysInMonth = new Date(year, month, 0).getDate(); // Số ngày trong tháng
    const allDates = Array.from({ length: daysInMonth }, (_, i) => {
      const day = i + 1;
      return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    });

    // Lấy danh sách các ngày có đơn hàng từ bảng Orders
    const orders = await Order.findAll({
      attributes: [[db.sequelize.fn('DATE', db.sequelize.col('OrderDate')), 'OrderDate']],
      where: {
        OrderDate: {
          [Op.between]: [
            `${year}-${String(month).padStart(2, '0')}-01`,
            `${year}-${String(month).padStart(2, '0')}-${daysInMonth}`,
          ],
        },
      },
      raw: true,
    });

    // Lấy danh sách các ngày có đơn hàng
    const orderDates = orders.map((order: any) => order.OrderDate);

    // Lọc ra các ngày không có đơn hàng
    const noOrderDates = allDates.filter((date) => !orderDates.includes(date));

    // Trả về danh sách các ngày không có đơn hàng
    return noOrderDates.map((date) => ({
      OrderDate: date,
      Month: month,
      Year: year,
    }));
  }

  public async fetchSecondHighestOrderDaysPerMonth() {
    // Lấy danh sách số lượng đơn hàng theo ngày
    const orders = await Order.findAll({
      attributes: [
        [db.sequelize.fn('DATE', db.sequelize.col('OrderDate')), 'OrderDate'], // Ngày đặt hàng
        [db.sequelize.fn('COUNT', db.sequelize.col('id')), 'OrderCount'], // Số lượng đơn hàng trong ngày
        [db.sequelize.fn('MONTH', db.sequelize.col('OrderDate')), 'Month'], // Tháng
        [db.sequelize.fn('YEAR', db.sequelize.col('OrderDate')), 'Year'], // Năm
      ],
      group: [
        db.sequelize.fn('DATE', db.sequelize.col('OrderDate')), // Nhóm theo ngày
        db.sequelize.fn('MONTH', db.sequelize.col('OrderDate')), // Nhóm theo tháng
        db.sequelize.fn('YEAR', db.sequelize.col('OrderDate')), // Nhóm theo năm
      ],
      raw: true,
    });

    // Nhóm dữ liệu theo tháng và năm
    const groupedByMonthYear = orders.reduce((acc: any, order: any) => {
      const key = `${order.Year}-${order.Month}`;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(order);
      return acc;
    }, {});

    // Tìm ngày có số lượng đơn hàng cao thứ hai trong mỗi tháng
    const secondHighestDays = Object.keys(groupedByMonthYear).map((key) => {
      const days = groupedByMonthYear[key];
      // Sắp xếp theo số lượng đơn hàng giảm dần
      days.sort((a: any, b: any) => b.OrderCount - a.OrderCount);
      // Lấy ngày có số lượng đơn hàng cao thứ hai
      return days[1] || null; // Nếu không có ngày thứ hai, trả về null
    });

    // Loại bỏ các giá trị null và trả về kết quả
    return secondHighestDays.filter((day) => day !== null);
  }

  public async fetchCustomerRankingByYear() {
    return await Order.findAll({
      attributes: [
        [db.sequelize.fn('YEAR', db.sequelize.col('OrderDate')), 'Year'], // Lấy năm từ OrderDate
        [db.sequelize.col('Customer.Name'), 'customerName'], // Lấy tên khách hàng
        [db.sequelize.fn('SUM', db.sequelize.literal('OrderDetails.Quantity * OrderDetails.Price')), 'totalSales'], // Tính tổng doanh số
      ],
      include: [
        {
          model: Customer,
          attributes: [], // Không cần thêm các cột khác từ bảng Customer
        },
        {
          model: OrderDetail,
          attributes: [], // Không cần thêm các cột khác từ bảng OrderDetail
        },
      ],
      group: [
        db.sequelize.col('Customer.Name'), // Nhóm theo tên khách hàng
        db.sequelize.fn('YEAR', db.sequelize.col('OrderDate')), // Nhóm theo năm
      ],
      order: [
        [db.sequelize.fn('YEAR', db.sequelize.col('OrderDate')), 'DESC'], // Sắp xếp theo năm giảm dần
        [db.sequelize.literal('totalSales'), 'DESC'], // Sắp xếp theo tổng doanh số giảm dần
      ],
    });
  }

  public async fetchOrderDetails() {
    return await Order.findAll({
      attributes: [
        [db.sequelize.col('Customer.Name'), 'CustomerName'], // Tên khách hàng
        [db.sequelize.col('Shipper.Name'), 'ShipperName'], // Tên shipper
        [db.sequelize.fn('SUM', db.sequelize.literal('OrderDetails.Quantity * OrderDetails.Price')), 'TotalAmount'], // Tổng tiền
      ],
      include: [
        {
          model: Customer,
          attributes: [], // Không cần thêm các cột khác từ bảng Customer
        },
        {
          model: Shipper,
          attributes: [], // Không cần thêm các cột khác từ bảng Shipper
        },
        {
          model: OrderDetail,
          attributes: [], // Không cần thêm các cột khác từ bảng OrderDetail
        },
      ],
      group: ['Order.id', 'Customer.Name', 'Shipper.Name'], // Nhóm theo ID đơn hàng, tên khách hàng, và tên shipper
      order: [[db.sequelize.col('Customer.Name'), 'ASC']], // Sắp xếp theo tên khách hàng tăng dần
      raw: true,
    });
  }

  public async fetchTotalAmountByCountry() {
    return await Customer.findAll({
      attributes: [
        'Country', // Lấy cột Country từ bảng Customers
        [
          db.sequelize.fn(
            'SUM',
            db.sequelize.literal('`Orders->OrderDetails`.`Quantity` * `Orders->OrderDetails`.`Price`')
          ),
          'TotalAmount', // Alias cho tổng tiền
        ],
      ],
      include: [
        {
          model: Order,
          attributes: [], // Không cần thêm các cột khác từ bảng Orders
          include: [
            {
              model: OrderDetail,
              attributes: [], // Không cần thêm các cột khác từ bảng OrderDetails
            },
          ],
        },
      ],
      group: ['Country'], // Nhóm theo quốc gia
      order: [[db.sequelize.literal('TotalAmount'), 'DESC']], // Sắp xếp theo tổng tiền giảm dần
      raw: true,
    });
  }

  public async fetchOrdersWithTotalAmountGreaterThan1000() {
    return await Order.findAll({
      attributes: [
        'id', // ID của đơn hàng
        [db.sequelize.literal("CONCAT(Customer.Name, ' - ID: ', Order.CustomerId)"), 'CustomerInfo'], // Thông tin khách hàng
        [db.sequelize.literal("CONCAT(Shipper.Name, ' - ID: ', Order.ShipperId)"), 'ShipperInfo'], // Thông tin shipper
        [db.sequelize.fn('SUM', db.sequelize.literal('OrderDetails.Quantity * OrderDetails.Price')), 'TotalAmount'], // Tổng tiền
        'OrderDate', // Ngày đặt hàng
      ],
      include: [
        {
          model: Customer,
          attributes: [], // Không cần thêm các cột khác từ bảng Customer
        },
        {
          model: Shipper,
          attributes: [], // Không cần thêm các cột khác từ bảng Shipper
        },
        {
          model: OrderDetail,
          attributes: [], // Không cần thêm các cột khác từ bảng OrderDetails
        },
      ],
      group: ['Order.id', 'Customer.Name', 'Shipper.Name'], // Nhóm theo ID đơn hàng, tên khách hàng, và tên shipper
      having: db.sequelize.literal('SUM(OrderDetails.Quantity * OrderDetails.Price) > 1000'), // Điều kiện tổng tiền > 1000
      order: [[db.sequelize.literal('TotalAmount'), 'DESC']], // Sắp xếp theo tổng tiền giảm dần
      raw: true,
    });
  }

public async fetchOrdersAboveAverage() {
  // Tính tổng trung bình của tất cả các đơn hàng
  const averageQuery = `
    SELECT AVG(TotalAmount) AS AverageAmount
    FROM (
      SELECT SUM(OrderDetails.Quantity * OrderDetails.Price) AS TotalAmount
      FROM Orders
      JOIN OrderDetails ON Orders.Id = OrderDetails.OrderId
      GROUP BY Orders.Id
    ) AS AvgAmount
  `;

  const result = await sequelize.query(averageQuery, { type: QueryTypes.SELECT });
  const averageAmount = result[0].AverageAmount;

  // Lấy danh sách các đơn hàng có tổng tiền lớn hơn trung bình
  return await Order.findAll({
    attributes: [
      ['id', 'OrderID'], // ID của đơn hàng
      [db.sequelize.literal("CONCAT(Customer.Name, ' - ID: ', Customer.id)"), 'CustomerInfo'], // Thông tin khách hàng
      [db.sequelize.literal("CONCAT(Shipper.Name, ' - ID: ', Shipper.id)"), 'ShipperInfo'], // Thông tin shipper
      [db.sequelize.fn('SUM', db.sequelize.literal('OrderDetails.Quantity * OrderDetails.Price')), 'TotalAmount'], // Tổng tiền
      'OrderDate', // Ngày đặt hàng
    ],
    include: [
      {
        model: Customer,
        attributes: [], // Không cần thêm các cột khác từ bảng Customer
      },
      {
        model: Shipper,
        attributes: [], // Không cần thêm các cột khác từ bảng Shipper
      },
      {
        model: OrderDetail,
        attributes: [], // Không cần thêm các cột khác từ bảng OrderDetails
      },
    ],
    group: ['Order.id', 'Customer.Name', 'Shipper.Name'], // Nhóm theo ID đơn hàng, tên khách hàng, và tên shipper
    having: db.sequelize.literal(`SUM(OrderDetails.Quantity * OrderDetails.Price) > ${averageAmount}`), // Điều kiện tổng tiền > trung bình
    order: [[db.sequelize.literal('TotalAmount'), 'ASC']], // Sắp xếp theo tổng tiền giảm dần
    raw: true,
  });
}
}