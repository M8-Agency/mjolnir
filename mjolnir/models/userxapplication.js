'use strict'

const Sequelize = require('sequelize');
const db = require('../lib/db');

module.exports = function setupUserxApplicationModel(config){
    const sequelize = db(config)

    return sequelize.define('userxapplication', {
        password: {
            type: Sequelize.STRING
        },
        userId:{
            type: Sequelize.INTEGER, 
            allowNull: false, 
        },
        applicationId:{
            type: Sequelize.INTEGER, 
            allowNull: false, 
        }        
    });
};