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

responseDetail = (actionData) => {
    var secondsPassed = 0
    if(actionData.rows.length > 0){
        var start = moment(actionData.rows[0].createdAt,'HH:mm:ss');
        secondsPassed = moment().diff(start, 'seconds');
    }

    return {
        count : actionData.count,
        last : actionData.rows[0],
        elapsedTime : (secondsPassed > 0) ? secondsPassed : -1
    }
}

validateAction = (action, actionDetail) => {
    let valid = false
    if(action.limit === 'unique' && actionDetail.count === 0){
        valid = true
    }else if(action.limit === 'daily'){
        //Cambiar para validar por dia no por tiempo        
        if(actionDetail.elapsedTime > 0 && actionDetail.elapsedTime < 86400){
            valid = false
        }else{
            if(actionDetail.count <= action.top){
                valid = true
            }else{
                valid = false
            }
            
        }
    }else if(action.limit === 'top' && actionDetail.count <= action.top){
        valid = true
    }
    return valid
}

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
                    res.status(200).json(responseDetail(actionData));
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
                            const actionDetail = responseDetail(actionData)
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
                                valid : validateAction(action, actionDetail),
                                primaryJson : req.body.primaryJson,
                                secondayJson : req.body.secondayJson
                            }
                            //Guardo la accion
                            ActionxUser.create(dataToSave).then((actionSaved) => {
                                res.status(200).json(actionSaved);3
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
