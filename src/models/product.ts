import { Model, DataTypes, Sequelize } from 'sequelize';

export default (sequelize: Sequelize): typeof Model => {
  class Product extends Model {
    public id!: number;
    public Name!: string;
    public UnitPrice!: number;
    public product_code!: number; // Thêm trường product_code
    public quantity!: number; // Thêm trường quantity

    static associate(models: any) {
      models.Product.hasMany(models.OrderDetail, { foreignKey: 'ProductId' });
    }
  }

  Product.init(
    {
      Name: DataTypes.STRING,
      UnitPrice: DataTypes.BIGINT,
      product_code: {
        type: DataTypes.INTEGER,
        unique: true, // Đảm bảo không trùng nhau
        allowNull: false, // Không được để trống
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false, // Không được để trống
      },
    },
    {
      sequelize,
      modelName: 'Product',
    }
  );

  return Product;
};