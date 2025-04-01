import { Model, DataTypes, Sequelize } from 'sequelize';

export default (sequelize: Sequelize): typeof Model => {
  class Product extends Model {
    public id!: number;
    public Name!: string;
    public UnitPrice!: number;

    static associate(models: any) {
      models.Product.hasMany(models.OrderDetail, { foreignKey: 'ProductId' });
    }
  }

  Product.init(
    {
      Name: DataTypes.STRING,
      UnitPrice: DataTypes.BIGINT,
    },
    {
      sequelize,
      modelName: 'Product',
    }
  );

  return Product;
};