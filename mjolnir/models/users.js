'use strict'

const Sequelize = require('sequelize');
const db = require('../lib/db');

module.exports = function setupUserModel(config){
    const sequelize = db(config)

    return sequelize.define('user', {
        username : {
            type: Sequelize.STRING, 
            allowNull: true,
        },
        name : {
            type: Sequelize.STRING, 
            allowNull: false,
        },
        lastname : {
            type: Sequelize.STRING, 
            allowNull: false,
        },
        email : {
            type: Sequelize.STRING, 
            allowNull: false,
            validate: {
                isEmail: true
            }            
        }
    })
};