'use strict'

const Sequelize = require('sequelize');
const db = require('../lib/db');

module.exports = function setupUserModel(config){
    const sequelize = db(config)

    return sequelize.define('user', {
        firstname : {
            type: Sequelize.STRING.STRING(64), 
            allowNull: false,
        },
        lastname : {
            type: Sequelize.STRING.STRING(64), 
            allowNull: false,
        },
        email : {
            type: Sequelize.STRING.STRING(64), 
            allowNull: false,
            validate: {
                isEmail: true
            }            
        },
        pic : {
            type: Sequelize.STRING, 
            allowNull: true,
            validate: {
                isUrl: true
            }                         
        },                
        username : {
            type: Sequelize.STRING.STRING(64), 
            allowNull: false,
        },
        gender : {
            type: Sequelize.STRING(1), 
            allowNull: false,
            validate: {
                isIn: [['m', 'f']],
            }
        },        
        address : {
            type: Sequelize.STRING, 
            allowNull: true,
        },
        zipcode : {
            type: Sequelize.STRING.STRING(32), 
            allowNull: true,
        },
        city : {
            type: Sequelize.STRING.STRING(32), 
            allowNull: true,
        },
        country : {
            type: Sequelize.STRING.STRING(32), 
            allowNull: true,
        },
        birthday : {
            type: Sequelize.DATEONLY, 
            allowNull: true,
            validate: {
                isDate: true
            }
        },
        phone : {
            type: Sequelize.STRING(64), 
            allowNull: true,
        }        
    })
};