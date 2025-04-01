import { Model, DataTypes, Sequelize } from 'sequelize';

export default (sequelize: Sequelize): typeof Model => {
  class Product extends Model {
    public id!: number;
    public Name!: string;
    public UnitPrice!: number;
    //product code != :number 

    static associate(models: any) {
      models.Product.hasMany(models.OrderDetail, { foreignKey: 'ProductId' });
    }
  }
  // them cuot emtyti
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