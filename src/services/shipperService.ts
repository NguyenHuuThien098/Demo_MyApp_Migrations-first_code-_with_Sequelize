import { fetchAllShippers } from '../repository/shipperRepository';

export const fetchAllShippersService = async () => {
  return await fetchAllShippers(); // Gọi repository để lấy dữ liệu
};