const { sequelize } = require('../models');

const connectDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1); // Thoát nếu không kết nối được
  }
};

module.exports = connectDatabase;