require("dotenv").config();

module.exports = {
  database: process.env.DB_DATABASE,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  dialect: "postgres",
  timezone: "-05:00",
  setup: true,
  ssl: true,
  dialectOptions: {
    ssl: {
      require: true
    }
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};
