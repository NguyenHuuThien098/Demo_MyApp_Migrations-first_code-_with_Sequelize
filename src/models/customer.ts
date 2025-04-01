import { Model, DataTypes, Sequelize } from 'sequelize';

export default (sequelize: Sequelize):typeof Model => {
  class Customer extends Model {
    public id!: number;
    public name!: string;
    public contactName!: string;
    public country!: string;
  }

  Customer.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: DataTypes.STRING,
      contactName: DataTypes.STRING,
      country: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Customer',
    }
  );

  return Customer;
};