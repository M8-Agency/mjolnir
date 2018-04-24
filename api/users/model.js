'use strict'

const Sequelize = require('sequelize');
const db = require('../lib/db');

module.exports = function setupUsersModel(config){
    const sequelize = db(config)

    return sequelize.define('user', {
        username : {
            type: Sequelize.STRING, 
            allowNull: true,
        },
        name : {
            type: Sequelize.STRING, 
            allowNull: true,
        },
        lastname : {
            type: Sequelize.STRING, 
            allowNull: true,
        },
        email : {
            type: Sequelize.STRING, 
            allowNull: true,
            validate: {
                isEmail: true
            }            
        }
    })
};