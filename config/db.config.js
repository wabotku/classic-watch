module.exports = {
    HOST: process.env.DBUSER_HOST,
    USER: process.env.DBUSER_USERNAME,
    PASSWORD: process.env.DBUSER_PASS,
    DB: process.env.DBUSER_DB,
    DB_CORE: process.env.DBCORE_DB,
    DB_MERCHANT: process.env.DBMERCHANT_DB,
    PORT: process.env.DBUSER_PORT,

    dialect: 'mysql',
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
    },
}