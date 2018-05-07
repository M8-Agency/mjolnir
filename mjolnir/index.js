require('dotenv').config();
const express = require('express')
const app = express.Router()
const bodyParser = require('body-parser');
const rest = require('./rest');
const usersRouter = require('./rest/users');
const auth = require('./auth')
const config = require('./lib/config')
const userModel = require('./models/users')
const md5 = require('md5')

module.exports = () => {
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({ extended: true }))
    
    app.use('/actions', rest());
    app.use('/applications', rest());
    app.use('/users', usersRouter());
    app.use('/actionxuser', rest());
    app.use('/userxapplication', rest());
    
    app.post('/signin', function(req, res, next) {
        
        const email = req.body['email']
        const password = md5(req.body['password'])

        const User = userModel(config)

        User.findOne({
            where : {
                email,
                password
            }
        }).then((userdata)=>{
            if(userdata){
                auth.sign({
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
                next(new Error('user not found'))
            }
            
        }).catch((error)=>{
            next(error)
        })
    })

    app.use((err, req, res, next) => {
        res.status(500).send({ 
          error : true,
          message : err.message,
          code : err.code
      })
    })    

    
    return app
}