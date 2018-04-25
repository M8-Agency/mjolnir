'use strict'

const Sequelize = require('sequelize');
const db = require('../lib/db');

module.exports = function setupActionModel(config){
    const sequelize = db(config)

    return sequelize.define('action', {
        name : {
            type: Sequelize.STRING, 
            allowNull: false,
        }
    })
};