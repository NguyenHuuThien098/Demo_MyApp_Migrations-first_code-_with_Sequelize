import fs from 'fs';
import path from 'path';
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

// Load biến môi trường từ file .env
dotenv.config();

const basename = path.basename(__filename);
const db: any = {};

// Khởi tạo Sequelize với thông tin từ .env
const sequelize = new Sequelize(
  process.env.DB_DATABASE as string,
  process.env.DB_USERNAME as string,
  process.env.DB_PASSWORD as string,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT as any,
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