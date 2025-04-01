import fs from 'fs';
import path from 'path';
import { Sequelize } from 'sequelize';
import configFile from '../config/config.json';

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = (configFile as any)[env];
const db: any = {};

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    dialect: config.dialect as any,
  }
);

// Import tất cả các model trong thư mục models
fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.ts' // Hoặc '.js' nếu bạn đang chạy từ thư mục dist
    );
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file)).default(sequelize);
    db[model.name] = model;
  });

// Gọi phương thức associate nếu có
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;