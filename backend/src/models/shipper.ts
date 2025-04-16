import { Model, DataTypes, Sequelize } from 'sequelize';

export default (sequelize: Sequelize): typeof Model => {
  class Shipper extends Model {
    public id!: number;
    public Name!: string;
    public shipper_code!: number; // Thêm trường shipper_code

    static associate(models: any) {
      models.Shipper.hasMany(models.Order, { foreignKey: 'ShipperId' });
    }
  }

  Shipper.init(
    {
      Name: DataTypes.STRING,
      shipper_code: {
        type: DataTypes.INTEGER,
        unique: true, // Đảm bảo không trùng nhau
        allowNull: false, // Không được để trống
      },
    },
    {
      sequelize,
      modelName: 'Shipper',
    }
  );

  return Shipper;
};