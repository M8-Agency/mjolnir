const Sequelize = require('sequelize');
module.exports = (db) => {
    return db.define('events', {
        name : {
            type: Sequelize.STRING, 
            allowNull: false,
        },
        code : {
            type: Sequelize.STRING, 
            allowNull: false,
        },    
        description : {
            type: Sequelize.STRING, 
            allowNull: true,
        },
        points : {
            type: Sequelize.INTEGER, 
            defaultValue : 0,
            allowNull: false,
        },
        limit : {
            type: Sequelize.STRING(12), 
            allowNull: false,
            validate: {
                isIn: [['unique', 'daily','top']],
            }
        },     
        top: {
            type : Sequelize.INTEGER(3),
            allowNull: false,
            defaultValue: 0
        },  
    })
}