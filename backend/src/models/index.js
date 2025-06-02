const { Sequelize } = require('sequelize');
const config = require('../config/database');

// Determine which environment we're in
const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

// Create Sequelize instance
const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: dbConfig.dialect,
    logging: dbConfig.logging,
    pool: dbConfig.pool,
    dialectOptions: dbConfig.dialectOptions,
  }
);

// Initialize models
const User = require('./user.model')(sequelize, Sequelize);
const Role = require('./role.model')(sequelize, Sequelize);
const Training = require('./training.model')(sequelize, Sequelize);
const Attendance = require('./attendance.model')(sequelize, Sequelize);
const Declaration = require('./declaration.model')(sequelize, Sequelize);

// Define associations
User.belongsTo(Role);
Role.hasMany(User);

Training.hasMany(Attendance);
Attendance.belongsTo(Training);

User.hasMany(Attendance);
Attendance.belongsTo(User);

Attendance.hasOne(Declaration);
Declaration.belongsTo(Attendance);

// Export models and Sequelize instance
module.exports = {
  sequelize,
  Sequelize,
  User,
  Role,
  Training,
  Attendance,
  Declaration,
};
