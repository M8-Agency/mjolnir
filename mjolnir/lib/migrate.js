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

    //Usuarios por aplicacion
    userModel.belongsToMany(applicationModel, { through: userxApplicationModel });
    applicationModel.belongsToMany(userModel, { through: userxApplicationModel });
    
    //Acciones por usuario
    /*
    userModel.hasMany(actionModel, { through: actionxUserModel, unique: false });
    actionModel.hasMany(userModel, { through: actionxUserModel, unique: false });    
    */
    userModel.hasMany( actionxUserModel, { as: 'userId' } );
    actionModel.hasMany( actionxUserModel, { as: 'actionId' } );

    applicationModel.hasMany( actionModel, { as: 'applicationId' } );
    //applicationModel.hasOne( actionModel );    

    sequelize.sync({ 
        force: true 
    }).then(()=>{
        process.exit(0)
    }).catch((error)=> {
        console.log('error', error)
        process.exit(1)
    })
}

function handleFatalError (err) {
  console.error(err.message)
  console.error(err.stack)
  process.exit(1)
}

migrate()