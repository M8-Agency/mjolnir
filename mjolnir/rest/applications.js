require('dotenv').config();
const express = require('express')
const auth = require('express-jwt')
const app = express.Router()
const config = require('../lib/config')
const applicationModel = require('../models/applications')
const emailModel = require('../models/email')
const jwt = require('jsonwebtoken')
const moment = require('moment')
const Mailgun = require('mailgun-js');
const db = require('../lib/db');
const sequelize = db(config)

const Applications = applicationModel(config)
const Email = emailModel(config)

//Email config
const mailgun = new Mailgun({
    apiKey: process.env.MAILER_KEY, 
    domain: process.env.MAILER_DOMAIN
});

const parseContent = function(str, data){
    for(index in data){
        str = str.replace(new RegExp(`{{${index}}}`, 'g'), data[index]);
    }
    return str
}

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

    app.post('/:applicationId/sendemail/:emailId', function(req, res, next) {
        jwt.verify(req.query.token, process.env.SECRET, function(error, user) {
            if(error){
                next(new Error('Not Authorized'))
            }else{

                Email.findById(req.params.emailId).then((response)=>{
                    
                    const emailData = {
                        from: process.env.MAILER_FROM,
                        to: req.body.email,
                        subject: parseContent(response.subject, req.body),
                        html: parseContent(response.htmlBody, req.body)
                    }

                    mailgun.messages().send(emailData, (error, body) => {
                        if (error) {
                            next(error)
                        }else {
                            res.status(200).json({
                                submit : true
                            });
                        }
                    });
        
                }).catch((error)=>{
                    next(error)
                })
            }
            
        });        
    })        

    return app
}

module.exports = api
