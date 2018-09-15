const Sequelize = require('sequelize');
module.exports = (db) => {
    return db.define('trivia_options', {
        option : {
            type: Sequelize.STRING, 
            allowNull: false,
        },    
        correct : {
            type: Sequelize.BOOLEAN, 
            allowNull: false,
        }
    })
}