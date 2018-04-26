module.exports = {
    database : 'postgres',
    username : 'postgres',
    password : 'root',
    host: 'localhost',
    dialect: 'postgres',
    setup : true,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }    
}