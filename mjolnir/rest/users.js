require('dotenv').config();
const express = require('express')
const auth = require('express-jwt')
const app = express.Router()
const config = require('../lib/config')
const responseData = require('./responseData')
const userModel = require('../models/users')
const md5 = require('md5')

api = () => {    
    
    const User = userModel(config)

    app.get('/', auth({secret: process.env.SECRET}), function(req, res, next) {
        if(!user || !user.id){
            next(new Error('Not Authorized'))
        }
        User.findById(req.user.id).then((userdata) => {
            res.status(200).json(userdata);
        })
    })

    app.get('/:id', auth({secret: process.env.SECRET}), function(req, res, next) {

        if(!user || !user.id){
            next(new Error('Not Authorized'))
        }
        
        let currentPromise = (user.isAdmin) ? User.findById(req.params.id) : User.findById(user.id);

        currentPromise.then(response => {
            res.status(200).json(response);
        }).catch( (error) => {
            next(error)
        });                    
    })    

    app.post('/', function(req, res, next) {        
        const data = req.body
        data.uid = md5(Date.now())
        data.password = (req.body.password) && md5(req.body.password)
        
        User.create(data).then( (response) => {
            res.status(200).json(response);
        }).catch( (error) => {
            next(error)
        })
    })
    
    return app
}

module.exports = api
