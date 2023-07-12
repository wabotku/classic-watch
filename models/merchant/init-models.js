const dbConfig = require("../../config/db.config");
const Sequelize = require("sequelize");
const sequelize = new Sequelize(
  dbConfig.DB_MERCHANT,
  dbConfig.USER,
  dbConfig.PASSWORD,
  {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    operatorAlias: false,
    pool: {
      max: dbConfig.pool.max,
      min: dbConfig.pool.min,
      acquire: dbConfig.pool.acquire,
      idle: dbConfig.pool.idle,
    },
    logging: false,
  }
);

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// define semua models yang ada pada aplikasi
db.merchant = require("./cw_m_merchant")(sequelize, Sequelize);
db.merk = require("./cw_m_merk")(sequelize, Sequelize);
db.product = require("./cw_m_product")(sequelize, Sequelize);

module.exports = db;
