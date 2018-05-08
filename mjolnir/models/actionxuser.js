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
        userId:{
            type: Sequelize.INTEGER, 
            allowNull: false, 
        },
        actionId:{
            type: Sequelize.INTEGER, 
            allowNull: false, 
        },        
        code: {
            type : Sequelize.STRING,
            allowNull: false, 
        },        
        category: {
            type : Sequelize.STRING,
            allowNull: true 
        },
        event: {
            type : Sequelize.STRING,
            allowNull: true 
        },   
        utm: {
            type : Sequelize.STRING,
            allowNull: true 
        },
        url: {
            type : Sequelize.STRING,
            allowNull: true,
            validate: {
                isUrl: true
            }              
        },
        image: {
            type : Sequelize.STRING,
            allowNull: true,
            validate: {
                isUrl: true
            }              
        },
        points: {
            type : Sequelize.INTEGER,
            allowNull: true,
            defaultValue: 0
        }              
    });
};