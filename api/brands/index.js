const express = require('express')
const app = express.Router()
const config = require('../lib/config')
const setupBrandModel = require('./model')


api = () => {
    const Brand = setupBrandModel(config);

    app.get('/', function(req, res, next) {
        console.log('req.query', req.query)
        const LIMIT = 3
        const PAGE = (req.query.page) ? parseInt(req.query.page) : 0

        Brand.findAndCountAll({
            
            limit : LIMIT,
            offset: PAGE * LIMIT

        }).then(brands => {
            let data = []
            brands.rows.map((item, index) => {
                data.push({
                    "type": "brand",
                    "id": item.id,
                    "attributes": item,                    
                })
            })

            res.status(200).json({
                data,
                meta : {
                    count : brands.count,
                    prev : `/api/brands${ (PAGE > 1) ? `?page=${PAGE-1}` : `` }`,
                    next : `/api/brands?page=${PAGE+1}`
                }
            });

        }).catch( (error) => {
            next(error)
        });        

    })

    app.post('/', function(req, res, next) {
        Brand.create({ 
            name : 'name'
        }).then( (response) => {
            res.status(200).json({
                success : true
            });
        }).catch( (error) => {
            res.status(400).json({
                success : false
            });
        })
    })

    return app
}

module.exports = {
    api
}    