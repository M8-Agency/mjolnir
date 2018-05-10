require('dotenv').config();
const express = require('express')
const auth = require('express-jwt')
const app = express.Router()
const config = require('../lib/config')
const actionModel = require('../models/actions')
const actionxuserModel = require('../models/actionxuser')
const jwt = require('jsonwebtoken')
const moment = require('moment')

const db = require('../lib/db');
const sequelize = db(config)

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

    app.get('/:applicationId/points', function(req, res, next) {
        jwt.verify(req.query.token, process.env.SECRET, function(error, user) {
            if(error){
                next(new Error('Not Authorized'))
            }else{
                sequelize.query(`
                    select  actions."applicationId", actionxusers."userId",  sum(actionxusers."points") from actionxusers
                    JOIN actions on actions."id" = actionxusers."actionId"
                    where actions."applicationId" = ${req.params.applicationId} and actionxusers."userId" = ${user.id}
                    GROUP BY actionxusers."userId", actions."applicationId"                                
                `, { type: sequelize.QueryTypes.SELECT}).then((actionData, rows) => {
                    res.status(200).json(actionData[0]);
                })
            }
        });        
    })    

    app.get('/:actionId/detail', function(req, res, next) {
        jwt.verify(req.query.token, process.env.SECRET, function(error, user) {
            if(error){
                next(new Error('Not Authorized'))
            }else{
                ActionxUser.findAndCountAll({
                    where: {
                        userId: user.id,
                        actionId: req.params.actionId,
                    },
                    order : [
                        ['createdAt', 'DESC']
                    ],
                }).then((actionData) => {
                    var minutesPassed = 0
                    if(actionData.rows.length > 0){
                        var start = moment(actionData.rows[0].createdAt,'HH:mm:ss');
                        minutesPassed = moment().diff(start, 'minutes');
                    }
                    res.status(200).json({
                        count : actionData.count,
                        last : actionData.rows[0],
                        elapsedTime : (minutesPassed > 0) ? minutesPassed : -1
                    });
                })
            }
        });        
    })    

    app.post('/', function(req, res, next) {

        jwt.verify(req.query.token, process.env.SECRET, function(error, user) {
            if(error){
                next(new Error('Not Authorized'))
            }else{
                ActionxUser.create({
                    userId : user.id,
                    actionId : parseInt(req.body.actionId),
                    code : req.body.code,
                    category : req.body.category,
                    event : req.body.event,
                    utm : req.body.utm,
                    url : req.body.url,
                    image : req.body.image,
                    points : req.body.points,
                    primaryJson : req.body.primaryJson,
                    secondayJson : req.body.secondayJson
                }).then((actionData) => {
                    res.status(200).json(actionData);
                }).catch((error) => {
                    next(error)
                })
            }
        });
    })    
    
    return app
}

module.exports = api
