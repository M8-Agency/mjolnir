'use strict'

const Sequelize = require('sequelize');
const db = require('../lib/db');

module.exports = function setupEmailModel(config){
    const sequelize = db(config)

    return sequelize.define('email', {
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
};