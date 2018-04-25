'use strict'

const Sequelize = require('sequelize');
const db = require('../lib/db');

module.exports = function setupBrandModel(config){
    const sequelize = db(config)

    return sequelize.define('brand', {
        name : {
            type: Sequelize.STRING, 
            allowNull: false,
        }
    })
};