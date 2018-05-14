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
        if(actionDetail.elapsedTime > 0 && actionDetail.elapsedTime < 86400){
            valid = false
        }else{
            valid = true
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
                //Busco detalles de la accion para conocer los limites
                Action.findById(req.body.actionId).then((response)=>{
                    //Guardo los datos de la accion
                    const action = response

                    //Busco detalles de la ultima accion del usuario
                    ActionxUser.findAndCountAll({
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
                        //Guardo la accion
                        ActionxUser.create({
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
                        }).then((actionSaved) => {
                            res.status(200).json(actionSaved);
                        }).catch((error) => {
                            next(error)
                        })                        

                    })


                }).catch((error)=>{

                })

                
            }
        });
    })    
    
    return app
}

module.exports = api
