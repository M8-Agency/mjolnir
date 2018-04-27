const express = require('express')
const app = express.Router()
const config = require('../lib/config')
const responseData = require('../lib/responseData')
const getmodel = require('./getmodel')

api = () => {    
    
    app.get('/', function(req, res, next) {

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

    app.get('/:id', function(req, res, next) {
        
        Model = getmodel(req.baseUrl)

        Model.findById(req.params.id).then(response => {
            res.status(200).json(response);
        }).catch( (error) => {
            next(error)
        });        
        
    })    

    app.post('/', function(req, res, next) {
        
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
