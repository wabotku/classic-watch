
const dbConfig = require("../../config/db.config");
const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorAlias: false,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// define semua models yang ada pada aplikasi
db.users = require("./users")(sequelize, Sequelize);
db.users_backend = require("./users_backend")(sequelize, Sequelize);
db.users_address = require("./users_address")(sequelize, Sequelize);
db.roles = require("./roles")(sequelize, Sequelize);

module.exports = db;
