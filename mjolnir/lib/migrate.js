'use strict'

const config = require('./config')
const setupDb = require('./db')

const setupUserModel = require('../models/users')
const setupActionModel = require('../models/actions')
const setupApplicationModel = require('../models/applications')
const setupUserxApplicationModel = require('../models/userxapplication')
const setupActionxUserModel = require('../models/actionxuser')

function migrate () {

    console.log(config)

    const sequelize = setupDb(config)
    
    const applicationModel = setupApplicationModel(config)
    const userModel = setupUserModel(config)
    const actionModel = setupActionModel(config)
    const userxApplicationModel = setupUserxApplicationModel(config)
    const actionxUserModel = setupActionxUserModel(config)

    userModel.belongsToMany(applicationModel, { through: userxApplicationModel });
    applicationModel.belongsToMany(userModel, { through: userxApplicationModel });

    userModel.belongsToMany(actionModel, { through: actionxUserModel });
    actionModel.belongsToMany(userModel, { through: actionxUserModel });    

    sequelize.sync({ 
        force: true 
    }).then(()=>{
        process.exit(0)
    }).catch(()=> {
        process.exit(1)
    })
}

function handleFatalError (err) {
  console.error(err.message)
  console.error(err.stack)
  process.exit(1)
}

migrate()