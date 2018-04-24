'use strict'

const Sequelize = require('sequelize')
let sequelize = null

module.exports = function db(config){
    if(!sequelize){
        sequelize = new Sequelize(config)
    }
    return sequelize
}