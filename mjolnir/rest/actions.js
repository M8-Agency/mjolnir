require('dotenv').config();
const express = require('express')
const auth = require('express-jwt')
const app = express.Router()
const config = require('../lib/config')
const actionModel = require('../models/actions')
const actionxuserModel = require('../models/actionxuser')
const jwt = require('jsonwebtoken')

const db = require('../lib/db');
const sequelize = db(config)
const Action = actionModel(config)
const ActionxUser = actionxuserModel(config)

const tools = require('./tools')
//Emails
const Mailer = require('../mailer')

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

    app.get('/:id/item', function(req, res, next) {

        ActionxUser.findById(req.params.id).then((actionData) => {
            res.status(200).json(actionData);
        }).catch((error)=>{
            next(error)
        })

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
                        valid : true
                    },
                    order : [
                        ['createdAt', 'DESC']
                    ],
                }).then((actionData) => {
                    res.status(200).json(tools.responseDetail(actionData));
                })
            }
        });        
    })    


    app.post('/', function(req, res, next) {
        
        jwt.verify(req.query.token, process.env.SECRET, function(error, user) {
            if(error){
                next(new Error('Not Authorized'))
            }else{

                Action.findById(req.body.actionId).then((response)=>{ //Busco detalles de la accion para conocer los limites
                    const action = response  //Guardo los datos de la accion
                    if(!action){
                        next(new Error('Action don\'t exist insert actions in database'))
                    }else{
                        ActionxUser.findAndCountAll({ //Busco detalles de la ultima accion del usuario
                            where: {
                                userId: (req.body.userId) ? req.body.userId : user.id,
                                actionId: req.body.actionId,
                                valid : true
                            },
                            order : [
                                ['createdAt', 'DESC']
                            ],
                        }).then((actionData) => {

                            

                            const actionDetail = tools.responseDetail(actionData)
                            const dataToSave = {
                                userId : (req.body.userId) ? req.body.userId : user.id,
                                actionId : parseInt(req.body.actionId),
                                code : req.body.code,
                                category : req.body.category,
                                event : req.body.event,
                                utm : req.body.utm,
                                url : req.body.url,
                                image : req.body.image,
                                points : (req.body.points) ? req.body.points : action.points, //Si los puntos no vienen en el post guarda los de action asociada
                                valid : tools.validateAction(action, actionDetail),
                                primaryJson : req.body.primaryJson,
                                secondayJson : req.body.secondayJson
                            }
                            //Guardo la accion
                            ActionxUser.create(dataToSave).then((actionSaved) => {
                                
                                if(req.body.emailConfig){
                                    Mailer.send(res, next, req.body.emailConfig.emailId, req.body.emailConfig, actionSaved)
                                }else{
                                    res.status(200).json(actionSaved);
                                }

                            }).catch((error) => {
                                next(error)
                            })                        

                        })                        
                    }
                }).catch((error)=>{
                    next(error)
                })
            }
        });
    })    
    
    return app
}

module.exports = api
