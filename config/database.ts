import { Sequelize } from 'sequelize';
import configFile from './config.json';

const env = process.env.NODE_ENV || 'development';
const config = (configFile as any)[env];

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

const connectDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1); // Thoát nếu không kết nối được
  }
};

export default connectDatabase;
export { sequelize };