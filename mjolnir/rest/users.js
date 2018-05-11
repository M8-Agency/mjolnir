require('dotenv').config();
const express = require('express')
const jwt = require('jsonwebtoken')
const app = express.Router()
const config = require('../lib/config')
const responseData = require('./responseData')
const userModel = require('../models/users')
const md5 = require('md5')
const User = userModel(config)

api = () => {    
    app.get('/', function(req, res, next) {

        jwt.verify(req.query.token, process.env.SECRET, function(error, user) {
            if(error){
                next(new Error('Not Authorized'))
            }else{
                User.findById(user.id).then((userdata) => {
                    res.status(200).json(userdata);
                })
            }
        })

    })

    app.get('/:id', function(req, res, next) {

        jwt.verify(req.query.token, process.env.SECRET, function(error, user) {
            if(error){
                next(new Error('Not Authorized'))
            }else{
                let currentPromise = (user.isAdmin) ? User.findById(req.params.id) : User.findById(user.id);

                currentPromise.then(response => {
                    res.status(200).json(response);
                }).catch( (error) => {
                    next(error)
                });     
            }
        })

    })    

    app.post('/', function(req, res, next) {        
        const data = req.body
        data.uid = md5(Date.now())
        data.password = (req.body.password) && md5(req.body.password)
        
        User.create(data).then( (response) => {

            jwt.sign({
                id : response.id,
                uid: response.uid,
                email: response.email,
                username: response.username,
                isAdmin: response.isAdmin,
            }, process.env.SECRET, (error, token)=>{
                if(error){
                    next(error)
                }else{
                    res.status(200).json({
                        user : response,
                        token
                    });
                }
            })

        }).catch( (error) => {
            next(error)
        })
    })
    
    return app
}

module.exports = api
