'use strict'

const Sequelize = require('sequelize');
const db = require('../lib/db');

module.exports = function setupActionxUser(config){
    const sequelize = db(config)

    return sequelize.define('actionxuser', {
        category: {
            type : Sequelize.STRING
        },
        event: {
            type : Sequelize.STRING
        },   
        utm: {
            type : Sequelize.STRING
        },                
    });
};