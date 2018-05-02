require('dotenv').config();
const express = require('express')
const auth = require('express-jwt')
const app = express.Router()
const config = require('../lib/config')
const responseData = require('./responseData')
const getmodel = require('./getmodel')

api = () => {    
    
    app.get('/', auth({secret: process.env.SECRET}), function(req, res, next) {

        Model = getmodel(req.baseUrl)

        const LIMIT = 20
        const PAGE = (req.query.page) ? parseInt(req.query.page) : 0

        Model.findAndCountAll({
            limit : LIMIT,
            offset: PAGE * LIMIT
        }).then(response => {
            res.status(200).json(responseData('alias', response, PAGE));
        }).catch( (error) => {
            next(error)
        });        
    })

    app.get('/:id', auth({secret: process.env.SECRET}), function(req, res, next) {
        
        Model = getmodel(req.baseUrl)

        Model.findById(req.params.id).then(response => {
            res.status(200).json(response);
        }).catch( (error) => {
            next(error)
        });        
        
    })    

    app.post('/', auth({secret: process.env.SECRET}), function(req, res, next) {
        
        Model = getmodel(req.baseUrl)
        
        Model.create(req.body).then( (response) => {
            res.status(200).json(response);
        }).catch( (error) => {
            next(error)
        })
    })
    
    return app
}

module.exports = api
