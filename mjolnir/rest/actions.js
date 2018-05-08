require('dotenv').config();
const express = require('express')
const auth = require('express-jwt')
const app = express.Router()
const config = require('../lib/config')
const actionModel = require('../models/actions')
const actionxuserModel = require('../models/actionxuser')
const jwt = require('jsonwebtoken')

const Action = actionModel(config)
const ActionxUser = actionxuserModel(config)

api = () => {    
    
    app.get('/', function(req, res, next) {

        jwt.verify(req.query.token, process.env.SECRET, function(error, user) {
            if(error){
                next(new Error('Not Authorized'))
            }else{
                ActionxUser.findAll({
                    where: {
                        userId: user.id
                    }
                }).then((actionData) => {
                    res.status(200).json(actionData);
                })
            }
        });
    })

    app.get('/:actionId', function(req, res, next) {
        jwt.verify(req.query.token, process.env.SECRET, function(error, user) {
            if(error){
                next(new Error('Not Authorized'))
            }else{
                ActionxUser.findAll({
                    where: {
                        userId: user.id,
                        actionId: req.params.actionId,
                    }
                }).then((actionData) => {
                    res.status(200).json(actionData);
                })
            }
        });        
    })
    
    return app
}

module.exports = api
