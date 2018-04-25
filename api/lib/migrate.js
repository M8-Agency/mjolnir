'use strict'

const config = require('./config')
const setupDb = require('./db')

const setupUserModel = require('../users/model')
const setupActionModel = require('../actions/model')
const setupBrandModel = require('../brands/model')
const setupApplicationModel = require('../applications/model')

function migrate () {

    const sequelize = setupDb(config)
    const userModel = setupUserModel(config)
    const actionModel = setupActionModel(config)
    const brandModel = setupBrandModel(config)
    const applicationModel = setupApplicationModel(config)

    
    userModel.hasMany(applicationModel)
    applicationModel.belongsTo(userModel)

    actionModel.hasMany(applicationModel)
    applicationModel.belongsTo(userModel)
    actionModel.hasMany(userModel)
    userModel.belongsTo(actionModel)
    
    applicationModel.hasMany(brandModel)
    brandModel.belongsTo(applicationModel)    

    sequelize.sync({ 
        force: true 
    }).then( ()=>{
        process.exit(0)
    }).catch( ()=> {
        process.exit(1)
    })
}

function handleFatalError (err) {
  console.error(err.message)
  console.error(err.stack)
  process.exit(1)
}

migrate()