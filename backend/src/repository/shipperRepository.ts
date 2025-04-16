import db from '../models';

const Shipper = db.Shipper;

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
}