const Sequelize = require('sequelize');
module.exports = (db) => {
    return db.define('emails', {
        name : {
            type: Sequelize.STRING, 
            allowNull: false,
        },
        code : {
            type: Sequelize.STRING, 
            allowNull: false,
        },        
        imagePath : {
            type: Sequelize.STRING, 
            allowNull: true,
        },
        subject : {
            type: Sequelize.STRING, 
            allowNull: false,
        },        
        htmlBody : {
            type: Sequelize.TEXT, 
            allowNull: false,
        },
        textBody : {
            type: Sequelize.TEXT, 
            allowNull: true,
        }               
    })
}