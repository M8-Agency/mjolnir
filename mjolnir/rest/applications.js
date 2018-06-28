require('dotenv').config();
const express = require('express')
const app = express.Router()
const jwt = require('jsonwebtoken')
const moment = require('moment')
const tools = require('./tools')
//DB
const config = require('../lib/config')
const db = require('../lib/db');
const sequelize = db(config)
//Models
const applicationModel = require('../models/applications')
const Applications = applicationModel(config)
const UserApplicationsModel = require('../models/userxapplication')
const UserApplications = UserApplicationsModel(config)
//Emails
const Mailer = require('../mailer')

api = () => {
    
    app.get('/', function(req, res, next) {
        jwt.verify(req.query.token, process.env.SECRET, (error, user) => {
            if(user && user.isAdmin){
                Applications.findAll().then((response) => {
                    res.status(200).json(response); 
                }).catch((error)=>{
                    next(error)
                })
            }else{
                next(new Error('Not Authorized'))
            }
        })
    })

    app.post('/', function(req, res, next) {
        jwt.verify(req.query.token, process.env.SECRET, (error, user) => {
            if(user && user.isAdmin){
                Applications.create(req.body).then((response) => {
                    res.status(200).json(response); 
                }).catch((error)=>{
                    next(error)
                })
            }else{
                next(new Error('Not Authorized'))
            }
        })
    })
    /**
     * Get points by application 
     * @param token id of application
     * @param req.params.applicationId id of user
     */
    app.get('/:applicationId/points', function(req, res, next) {
        jwt.verify(req.query.token, process.env.SECRET, (error, user) => {
            if(error){
                next(new Error('Not Authorized'))
            }else{
                sequelize.query(`
                    select  actions."applicationId", actionxusers."userId", sum(actionxusers."points") as points from actionxusers
                    JOIN actions on actions."id" = actionxusers."actionId"
                    where actions."applicationId" = ${req.params.applicationId} and actionxusers."userId" = ${user.id} and actionxusers.valid = 't'
                    GROUP BY actionxusers."userId", actions."applicationId"                                
                `, { type: sequelize.QueryTypes.SELECT}).then((actionData, rows) => {
                    if(actionData.length > 0){
                        res.status(200).json(actionData[0]);    
                    }else{
                        res.status(200).json({ 
                            applicationId: 1, 
                            userId: user.id, 
                            points: '0',
                        });
                    }
                })
            }
        });        
    })

    /**
     * Register user to userxapplications table
     * @param token
     * @param req.body.applicationId id of application
     * @param req.body.userId id of user
     */
    app.post('/:applicationId/adduser', function(req, res, next){
        jwt.verify(req.query.token, process.env.SECRET, (error, user) => {
            if(user.isAdmin){
                UserApplications.create({
                    userId : req.body.userId,
                    applicationId : req.body.applicationId
                }).then( (response) => {
                    res.status(200).json(response);
                }).catch( (error) => {
                    next(error)
                })  
            }else{
                next(new Error('Not Authorized'))
            }
        })
    });

    app.post('/:applicationId/sendemail/:emailId', function(req, res, next) {
        jwt.verify(req.query.token, process.env.SECRET, (error, user) => {
            if(error){
                next(new Error('Not Authorized'))
            }else{
                Mailer.send(res, next, req.params.emailId, req.body, { submit : true})
            }
            
        });        
    })        

    return app
}

module.exports = api
