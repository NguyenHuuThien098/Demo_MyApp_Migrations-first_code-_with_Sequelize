import { ShipperRepository } from '../repository/shipperRepository';

export class ShipperService {
  private shipperRepository: ShipperRepository;

  constructor() {
    this.shipperRepository = new ShipperRepository();
  }

  public async fetchAllShippers() {
    return await this.shipperRepository.fetchAllShippers();
  }

  public async fetchShipperById(id: number) {
    return await this.shipperRepository.fetchShipperById(id);
  }

  public async createShipper(shipperData: any) {
    return await this.shipperRepository.createShipper(shipperData);
  }

  public async deleteShipperById(id: number) {
    return await this.shipperRepository.deleteShipperById(id);
  }

  public async updateShipperById(id: number, shipperData: any) {
    return await this.shipperRepository.updateShipperById(id, shipperData);
  }
}