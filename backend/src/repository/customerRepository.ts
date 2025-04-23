import db from '../models';
import { QueryTypes } from 'sequelize';
// import { Op } from 'sequelize';

const Customer = db.Customer;
const sequelize = db.sequelize;

export class CustomerRepository {
  public async fetchAllCustomers() {
    return await Customer.findAll(); // Lấy tất cả khách hàng
  }

  public async fetchCustomerById(id: number) {
    return await Customer.findByPk(id); // Tìm khách hàng theo ID
  }

  public async createCustomer(customerData: any) {
    return await Customer.create(customerData); // Tạo mới khách hàng
  }

  public async deleteCustomerById(id: number) {
    return await Customer.destroy({ where: { id } }); // Xóa khách hàng theo ID
  }

  public async fetchTopCustomerByCountry() {
    return await Customer.findAll({
      attributes: [
        'country', // Lấy cột Country từ bảng Customers
        ['name', 'CustomerName'], // Lấy tên khách hàng
        [db.sequelize.fn('SUM', db.sequelize.literal('`Orders->OrderDetails`.`Quantity` * `Orders->OrderDetails`.`Price`')), 'TotalSpent'], // Tính tổng tiền
      ],
      include: [
        {
          model: db.Order,
          attributes: [], // Không cần thêm các cột khác từ bảng Orders
          include: [
            {
              model: db.OrderDetail,
              attributes: [], // Không cần thêm các cột khác từ bảng OrderDetails
            },
          ],
        },
      ],
      group: ['Customer.country', 'Customer.name'], // Nhóm theo quốc gia và tên khách hàng
      order: [[db.sequelize.literal('TotalSpent'), 'DESC']], // Sắp xếp theo tổng tiền giảm dần
      raw: true,
    }).then((results: any) => {
      // Lọc kết quả để chỉ lấy khách hàng có tổng tiền cao nhất trong từng quốc gia
      const topCustomersByCountry = results.reduce((acc: any, customer: any) => {
        if (!acc[customer.country] || acc[customer.country].TotalSpent < customer.TotalSpent) {
          acc[customer.country] = customer;
        }
        return acc;
      }, {});
  
      return Object.values(topCustomersByCountry);
    });
  }

  public async fetchCustomerTotalSpent() {
    return await Customer.findAll({
      attributes: [
        ['name', 'CustomerName'], // Lấy tên khách hàng
        [db.sequelize.fn('SUM', db.sequelize.literal('`Orders->OrderDetails`.`Quantity` * `Orders->OrderDetails`.`Price`')), 'TotalSpent'], // Tính tổng tiền
      ],
      include: [
        {
          model: db.Order,
          attributes: [], // Không cần thêm các cột khác từ bảng Orders
          include: [
            {
              model: db.OrderDetail,
              attributes: [], // Không cần thêm các cột khác từ bảng OrderDetails
            },
          ],
        },
      ],
      group: ['Customer.name'], // Nhóm theo tên khách hàng
      order: [['name', 'ASC']], // Sắp xếp theo tên khách hàng tăng dần
      raw: true,
    });
  }

  public async fetchCustomersWithThreeMonthsNoOrders() {
    return await Customer.findAll({
      attributes: ['id', 'name'], // Lấy ID và tên khách hàng
      include: [
        {
          model: db.Order,
          attributes: [], // Không cần thêm các cột khác từ bảng Orders
          required: false, // Sử dụng LEFT JOIN để lấy cả khách hàng không có đơn hàng
          where: {
            OrderDate: {
              [db.Sequelize.Op.notBetween]: [
                db.Sequelize.literal("DATE_SUB(CURDATE(), INTERVAL 3 MONTH)"),
                db.Sequelize.literal("CURDATE()"),
              ],
            },
          },
        },
      ],
      raw: true,
    });
  }

  public async fetchCustomerTotalSaleRankingsByYear() {
    return await Customer.findAll({
      attributes: [
        [db.sequelize.fn('YEAR', db.sequelize.col('Orders.OrderDate')), 'Year'], // Lấy năm từ OrderDate
        ['name', 'CustomerName'], // Lấy tên khách hàng
        [db.sequelize.fn('SUM', db.sequelize.literal('`Orders->OrderDetails`.`Quantity` * `Orders->OrderDetails`.`Price`')), 'TotalSales'], // Tính tổng doanh số
      ],
      include: [
        {
          model: db.Order,
          attributes: [], // Không cần thêm các cột khác từ bảng Orders
          required: true, // Chỉ lấy các khách hàng có đơn hàng
          include: [
            {
              model: db.OrderDetail,
              attributes: [], // Không cần thêm các cột khác từ bảng OrderDetails
            },
          ],
        },
      ],
      where: db.sequelize.where(db.sequelize.fn('YEAR', db.sequelize.col('Orders.OrderDate')), {
        [db.Sequelize.Op.ne]: null, // Loại bỏ các bản ghi có OrderDate null
      }),
      group: ['Year', 'Customer.name'], // Nhóm theo năm và tên khách hàng
      order: [
        [db.sequelize.fn('YEAR', db.sequelize.col('Orders.OrderDate')), 'DESC'], // Sắp xếp theo năm giảm dần
        [db.sequelize.literal('TotalSales'), 'DESC'], // Sắp xếp theo tổng doanh số giảm dần
      ],
      raw: true,
    }).then((results: any) => {
      // Nhóm kết quả theo năm
      const rankingsByYear = results.reduce((acc: any, record: any) => {
        const year = record.Year;
        if (!acc[year]) {
          acc[year] = [];
        }
        acc[year].push({
          Name: record.CustomerName,
          TotalSales: record.TotalSales,
        });
        return acc;
      }, {});

      // Chuyển đổi kết quả thành mảng
      return Object.entries(rankingsByYear).map(([year, customers]) => ({
        Year: year,
        Customers: customers,
      }));
    });
  }

  public async searchCustomers(limit: number, offset: number, searchText: string, filters: any = {}) {
    // Build the WHERE clause for filtering
    let whereConditions = [];
    const replacements: any = {
      limit,
      offset
    };

    // Search by name or contact name if provided
    if (searchText && searchText.trim() !== '') {
      whereConditions.push(`(Customer.name LIKE :searchPattern OR Customer.contactName LIKE :searchPattern)`);
      replacements.searchPattern = `%${searchText.trim()}%`;
    }

    // Filter by country if provided
    if (filters.country && filters.country.trim() !== '') {
      whereConditions.push(`Customer.country = :country`);
      replacements.country = filters.country;
    }

    // Filter by user status if UserId is provided
    let userJoin = '';
    if (filters.hasUser !== undefined) {
      userJoin = 'LEFT JOIN users AS User ON Customer.UserId = User.id';
      if (filters.hasUser === true) {
        whereConditions.push('Customer.UserId IS NOT NULL');
      } else {
        whereConditions.push('Customer.UserId IS NULL');
      }
    }

    // Build the where clause
    const whereClause = whereConditions.length > 0 
      ? `WHERE ${whereConditions.join(' AND ')}` 
      : '';

    // Final query with sorting and pagination
    const query = `
      SELECT 
        Customer.id,
        Customer.name,
        Customer.contactName,
        Customer.country,
        Customer.UserId,
        ${filters.includeUser ? 'User.username, User.email, User.isActive' : 'NULL as username, NULL as email, NULL as isActive'}
      FROM Customers AS Customer
      ${userJoin}
      ${whereClause}
      ORDER BY ${filters.orderBy || 'Customer.name'} ${filters.orderDirection || 'ASC'}
      LIMIT :limit OFFSET :offset;
    `;

    const rows = await sequelize.query(query, {
      type: QueryTypes.SELECT,
      replacements,
    });

    // Count total results for pagination
    const countQuery = `
      SELECT COUNT(*) AS total
      FROM Customers AS Customer
      ${userJoin}
      ${whereClause}
    `;

    const countResult = await sequelize.query(countQuery, {
      type: QueryTypes.SELECT,
      replacements,
    });

    const total = countResult[0]?.total || 0;

    return { rows, count: total };
  }
}