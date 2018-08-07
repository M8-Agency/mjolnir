'use strict'

const Sequelize = require('sequelize');
const db = require('../lib/db');

module.exports = function setupActionModel(config){
    const sequelize = db(config)

    return sequelize.define('action', {
        name : {
            type: Sequelize.STRING, 
            allowNull: false,
        },
        code : {
            type: Sequelize.STRING, 
            allowNull: false,
        },    
        /**
         * sendEmail boolean
         * emailCode string
         */
        description : {
            type: Sequelize.STRING, 
            allowNull: true,
        },
        points : {
            type: Sequelize.INTEGER, 
            defaultValue : 0,
            allowNull: true,
        },
        limit : {
            type: Sequelize.STRING(12), 
            allowNull: false,
            validate: {
                isIn: [['unique', 'daily','top']],
            }
        },     
        top: {
            type : Sequelize.INTEGER,
            allowNull: true,
            defaultValue: 0
        },         
    })
};