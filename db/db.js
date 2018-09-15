'use strict'

const Sequelize = require('sequelize')
let sequelize = null

module.exports = (dbConfig) => {
    if(!sequelize){
        sequelize = new Sequelize(dbConfig)
    }
    return sequelize
}