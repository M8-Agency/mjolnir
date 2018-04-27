'use strict'

const Sequelize = require('sequelize');
const db = require('../lib/db');

module.exports = function setupActionxUser(config){
    const sequelize = db(config)

    return sequelize.define('actionxuser', {
        id: {
            type : Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        category: {
            type : Sequelize.STRING
        },
        event: {
            type : Sequelize.STRING
        },   
        utm: {
            type : Sequelize.STRING
        },
        userId:{
            type: Sequelize.INTEGER, 
            allowNull: false, 
        },
        actionId:{
            type: Sequelize.INTEGER, 
            allowNull: false, 
        }        
    });
};