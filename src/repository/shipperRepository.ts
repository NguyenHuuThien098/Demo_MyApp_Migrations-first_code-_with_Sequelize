import db from '../models';

const Shipper = db.Shipper;

export const fetchAllShippers = async () => {
  return await Shipper.findAll(); // Lấy tất cả các shipper
};