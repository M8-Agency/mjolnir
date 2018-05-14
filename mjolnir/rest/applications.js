require('dotenv').config();
const express = require('express')
const auth = require('express-jwt')
const app = express.Router()
const config = require('../lib/config')
const applicationModel = require('../models/applications')
const jwt = require('jsonwebtoken')
const moment = require('moment')

const db = require('../lib/db');
const sequelize = db(config)

const Applications = applicationModel(config)

api = () => {    
    
    app.get('/:applicationId/points', function(req, res, next) {
        jwt.verify(req.query.token, process.env.SECRET, function(error, user) {
            if(error){
                next(new Error('Not Authorized'))
            }else{
                sequelize.query(`
                    select  actions."applicationId", actionxusers."userId", sum(actionxusers."points") as points from actionxusers
                    JOIN actions on actions."id" = actionxusers."actionId"
                    where actions."applicationId" = ${req.params.applicationId} and actionxusers."userId" = ${user.id} and actionxusers.valid = 't'
                    GROUP BY actionxusers."userId", actions."applicationId"                                
                `, { type: sequelize.QueryTypes.SELECT}).then((actionData, rows) => {
                    res.status(200).json(actionData[0]);
                })
            }
        });        
    })    

    return app
}

module.exports = api
