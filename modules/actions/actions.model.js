const Sequelize = require('sequelize');
module.exports = (db) => {
    return db.define('actions', {
        id: {
            type : Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        code: {
            type : Sequelize.STRING,
            allowNull: false, 
        },        
        category: {
            type : Sequelize.STRING,
            allowNull: true 
        },
        event: {
            type : Sequelize.STRING,
            allowNull: true 
        },   
        utm: {
            type : Sequelize.STRING,
            allowNull: true 
        },
        url: {
            type : Sequelize.STRING,
            allowNull: true,
            validate: {
                isUrl: true
            }              
        },
        image: {
            type : Sequelize.STRING,
            allowNull: true,
            validate: {
                isUrl: true
            }              
        },
        points: {
            type : Sequelize.INTEGER,
            allowNull: true,
            defaultValue: 0
        },
        valid: {
            type: Sequelize.BOOLEAN, 
            defaultValue: false,
            allowNull: true,
        },        
        primaryJson : {
            type : Sequelize.JSON,
            allowNull: true
        },
        secondaryJson : {
            type : Sequelize.JSON,
            allowNull: true
        },
        userId: {
            type : Sequelize.INTEGER,
            allowNull: false, 
        },
        eventId: {
            type : Sequelize.INTEGER,
            allowNull: false, 
        },        
    })
}