require('dotenv').config();
const express = require('express')
const auth = require('express-jwt')
const app = express.Router()
const config = require('../lib/config')
const responseData = require('./responseData')
const userModel = require('../models/users')

api = () => {    
    
    const User = userModel(config)

    app.get('/', auth({secret: process.env.SECRET}), function(req, res, next) {

        console.log('req.user', req.user)

        const LIMIT = 20
        const PAGE = (req.query.page) ? parseInt(req.query.page) : 0

        User.findAndCountAll({
            limit : LIMIT,
            offset: PAGE * LIMIT
        }).then(response => {
            res.status(200).json(responseData('alias', response, PAGE));
        }).catch( (error) => {
            next(error)
        });        
    })

    app.get('/:id', auth({secret: process.env.SECRET}), function(req, res, next) {

        User.findById(req.params.id).then(response => {
            res.status(200).json(response);
        }).catch( (error) => {
            next(error)
        });        
        
    })    

    app.post('/', auth({secret: process.env.SECRET}), function(req, res, next) {        
        User.create(req.body).then( (response) => {
            res.status(200).json(response);
        }).catch( (error) => {
            next(error)
        })
    })
    
    return app
}

module.exports = api
