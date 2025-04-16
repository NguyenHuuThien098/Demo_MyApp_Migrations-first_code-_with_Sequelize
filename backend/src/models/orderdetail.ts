import { Model, DataTypes, Sequelize } from 'sequelize';

export default (sequelize: Sequelize): typeof Model => {
  class OrderDetail extends Model {
    public id!: number;
    public OrderId!: number;
    public ProductId!: number;
    public Quantity!: number;
    public Price!: number;

    static associate(models: any) {
      models.OrderDetail.belongsTo(models.Order, { foreignKey: 'OrderId' });
      models.OrderDetail.belongsTo(models.Product, { foreignKey: 'ProductId' });
    }
  }

  OrderDetail.init(
    {
      OrderId: DataTypes.INTEGER,
      ProductId: DataTypes.INTEGER,
      Quantity: DataTypes.INTEGER,
      Price: DataTypes.BIGINT,
    },
    {
      sequelize,
      modelName: 'OrderDetail',
    }
  );

  return OrderDetail;
};