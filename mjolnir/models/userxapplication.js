'use strict'

const Sequelize = require('sequelize');
const db = require('../lib/db');

module.exports = function setupUserxApplicationModel(config){
    const sequelize = db(config)

    return sequelize.define('userxapplication', {
        password: Sequelize.STRING
    });
};