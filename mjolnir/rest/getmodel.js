const config = require('../lib/config')

const userModel = require('../models/users')
const actionModel = require('../models/actions')
const applicationModel = require('../models/applications')
const userxApplicationModel = require('../models/userxapplication')
const actionxUserModel = require('../models/actionxuser')

module.exports = function(base){
    switch(base){
        case '/api/actions':
            return actionModel(config)

        case '/api/applications':
            return applicationModel(config)
            
        case '/api/users':
            return userModel(config)
    }

}