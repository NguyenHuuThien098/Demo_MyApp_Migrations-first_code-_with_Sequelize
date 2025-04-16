import { Model, DataTypes, Sequelize } from 'sequelize';

export default (sequelize: Sequelize):typeof Model  => {
  class Order extends Model {
    public id!: number;
    public CustomerId!: number;
    public OrderDate!: Date;
    public ShipperId!: number;

    static associate(models: any) {
      models.Order.belongsTo(models.Customer, { foreignKey: 'CustomerId' });
      models.Order.belongsTo(models.Shipper, { foreignKey: 'ShipperId' });
      models.Order.hasMany(models.OrderDetail, { foreignKey: 'OrderId' });
    }
  }

  Order.init(
    {
      CustomerId: DataTypes.INTEGER,
      OrderDate: DataTypes.DATE,
      ShipperId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'Order',
    }
  );

  return Order;
};