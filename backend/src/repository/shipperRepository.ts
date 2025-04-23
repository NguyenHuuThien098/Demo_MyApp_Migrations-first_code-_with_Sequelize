import db from '../models';
import { QueryTypes } from 'sequelize';

const Shipper = db.Shipper;
const sequelize = db.sequelize;

export class ShipperRepository {
  public async fetchAllShippers() {
    return await Shipper.findAll(); // Lấy tất cả các shipper
  }

  public async fetchShipperById(id: number) {
    return await Shipper.findByPk(id); // Lấy shipper theo ID
  }

  public async createShipper(shipperData: any) {
    return await Shipper.create(shipperData); // Thêm shipper mới
  }

  public async deleteShipperById(id: number) {
    return await Shipper.destroy({ where: { id } }); // Xóa shipper theo ID
  }

  public async updateShipperById(id: number, shipperData: any) {
    return await Shipper.update(shipperData, { where: { id }, returning: true }); // Sửa shipper theo ID
  }

  public async searchShippers(limit: number, offset: number, searchText: string, filters: any = {}) {
    // Build the WHERE clause for filtering
    let whereConditions = [];
    const replacements: any = {
      limit,
      offset
    };

    // Search by name if provided
    if (searchText && searchText.trim() !== '') {
      whereConditions.push(`Name LIKE :searchPattern`);
      replacements.searchPattern = `%${searchText.trim()}%`;
    }

    // Filter by shipper_code if provided
    if (filters.shipperCode) {
      whereConditions.push(`shipper_code = :shipperCode`);
      replacements.shipperCode = filters.shipperCode;
    }

    // Build the where clause
    const whereClause = whereConditions.length > 0 
      ? `WHERE ${whereConditions.join(' AND ')}`
      : '';

    // Final query with sorting and pagination
    const query = `
      SELECT 
        id, 
        Name, 
        shipper_code
      FROM Shippers
      ${whereClause}
      ORDER BY ${filters.orderBy || 'Name'} ${filters.orderDirection || 'ASC'}
      LIMIT :limit OFFSET :offset;
    `;

    const rows = await sequelize.query(query, {
      type: QueryTypes.SELECT,
      replacements,
    });

    // Count total results for pagination
    const countQuery = `
      SELECT COUNT(*) AS total
      FROM Shippers
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