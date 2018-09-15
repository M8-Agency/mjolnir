const Sequelize = require('sequelize');
module.exports = (db) => {
    return db.define('trivia_set', {
        name : {
            type: Sequelize.STRING, 
            allowNull: false,
        },
        description : {
            type: Sequelize.STRING, 
            allowNull: true,
        },    
        locale : {
            type: Sequelize.STRING(2), 
            allowNull: false,
        },
        code : {
            type: Sequelize.STRING, 
            allowNull: false,
        },  
        enabled : {
            type: Sequelize.BOOLEAN, 
            allowNull: false,
            defaultValue: false
        },
        startTime : {
            type: Sequelize.DATE, 
            allowNull: false,
        },        
    })
}