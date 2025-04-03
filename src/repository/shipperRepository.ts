import db from '../models';

const Shipper = db.Shipper;

export const fetchAllShippers = async () => {
  return await Shipper.findAll(); // Lấy tất cả các shipper
};

export const fetchShipperById = async (id: number) =>{
  return await Shipper.findByPk(id);
}

export const createShipper = async (shipperData: any) => {
  return await Shipper.create(shipperData);
};

// Xóa shipper theo ID
export const deleteShipperById = async (id: number) => {
  return await Shipper.destroy({ where: { id } });
};

// Sửa shipper theo ID
export const updateShipperById = async (id: number, shipperData: any) => {
  return await Shipper.update(shipperData, { where: { id }, returning: true });
};