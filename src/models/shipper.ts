import { Model, DataTypes, Sequelize } from 'sequelize';

export default (sequelize: Sequelize): typeof Model => {
  class Shipper extends Model {
    public id!: number;
    public Name!: string;
    //shpper code : number !=
    static associate(models: any) {
      models.Shipper.hasMany(models.Order, { foreignKey: 'ShipperId' });
    }
  }

  Shipper.init(
    {
      Name: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Shipper',
    }
  );

  return Shipper;
};