const express = require('express')
const app = express.Router()
const userModel = require('../models/users')
const config = require('../lib/config')
const jwt = require('jsonwebtoken')
const md5 = require('md5')
const User = userModel(config)

api = () => {  

    app.post('/verify', function(req, res, next) {
        User.findOne({
            where : {
                email : req.body.email
            }
        }).then((userdata)=>{
            if(userdata){
                jwt.sign({
                    id : userdata.id,
                    uid: userdata.uid,
                    email: userdata.email,
                    username: userdata.username,
                    isAdmin: userdata.isAdmin,
                }, process.env.SECRET, (err, token)=>{
                    if(err){
                        next(err)
                    }else{
                        res.status(200).json({
                            user : userdata,
                            token
                        });
                    }
                })                
            }else{
                next(new Error('email don\'t exist'))
            }   
           
        }).catch((error)=>{
            next(error)
        })
    })

    app.post('/signin', function(req, res, next) {
        const email = req.body.email
        const password = md5(req.body.password)

        User.findOne({
            where : {
                email,
                password
            }
        }).then((userdata)=>{
            if(userdata){
                jwt.sign({
                    id : userdata.id,
                    uid: userdata.uid,
                    email: userdata.email,
                    username: userdata.username,
                    isAdmin: userdata.isAdmin,
                }, process.env.SECRET, (err, token)=>{
                    if(err){
                        next(err)
                    }else{
                        res.status(200).json({
                            token
                        });
                    }
                })
            }else{
                next(new Error('User not found'))
            }
            
        }).catch((error)=>{
            next(error)
        })
    })

    return app
}

module.exports = api    