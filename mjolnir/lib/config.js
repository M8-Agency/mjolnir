module.exports = {
    database : process.env.DATABASE,
    username : process.env.USERNAME,
    password : process.env.PASSWORD,
    host: process.env.HOST,
    dialect: 'postgres',
    setup : true,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }    
}