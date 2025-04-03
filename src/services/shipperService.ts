import { fetchAllShippers, fetchShipperById,createShipper,deleteShipperById,updateShipperById } from '../repository/shipperRepository';

export const fetchAllShippersService = async () => {
  return await fetchAllShippers(); // Gọi repository để lấy dữ liệu
};

export const fetchShipperByIdService = async(id: number) =>{
  return await fetchShipperById(id);
}

export const createShipperService = async (shipperData: any) => {
  return await createShipper(shipperData);
};

export const deleteShipperByIdService = async (id: number) => {
  return await deleteShipperById(id);
};

export const updateShipperByIdService = async (id: number, shipperData: any) => {
  return await updateShipperById(id, shipperData);
};