'use strict'

const Sequelize = require('sequelize');
const db = require('../lib/db');

module.exports = function setupApplicationModel(config){
    const sequelize = db(config)

    return sequelize.define('application', {
        name : {
            type: Sequelize.STRING, 
            allowNull: false,
        },
        brandId : {
            type: Sequelize.INTEGER, 
            allowNull: false,            
        }
    })
};