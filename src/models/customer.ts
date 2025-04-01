import { Model, DataTypes, Sequelize } from 'sequelize';


export default(sequelize: Sequelize): typeof Model => {
  class Customer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    public id!: number;
    public Name!: string;
    public ContactName!: string;
    public Country!: string;
    static associate(models: any) {
      models.Customer.hasMany(models.Order,{foreignKey: 'CustomerID'});
    }
  }
  Customer.init({
    Name: DataTypes.STRING,
    ContactName: DataTypes.STRING,
    Country: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Customer',
  });
  return Customer;
};