require('dotenv').config();
const express = require('express')
const jwt = require('jsonwebtoken')
const app = express.Router()
const tools = require('./tools')
const axios = require('axios')

api = () => {    
    app.post('/', function(req, res, next) {
        jwt.verify(req.query.token, process.env.SECRET, function(error, user) {
            if(error){
                next(new Error('Not Authorized'))
            }else{
                axios.post(`https://vision.googleapis.com/v1/images:annotate?key=${process.env.VISION_KEY}`, req.body.imageData)
                .then((response)=>{
                    res.status(200).json(response.data);
                })
                .catch((error)=>{
                    res.status(500).json(error);
                });                      
            }
        })

    })
    return app
}

module.exports = api
