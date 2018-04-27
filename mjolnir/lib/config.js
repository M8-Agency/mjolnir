require('dotenv').config();

module.exports = {
    database : process.env.DB,
    username : process.env.DB_USERNAME,
    password : process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    dialect: 'postgres',
    setup : true,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }    
}