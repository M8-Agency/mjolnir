require('dotenv').config();
const express = require('express')
const app = express.Router()
const bodyParser = require('body-parser');
const rest = require('./rest');
const auth = require('./auth')
const config = require('./lib/config')
const userModel = require('./models/users')

module.exports = () => {
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({ extended: true }))
    
    app.use('/actions', rest());
    app.use('/applications', rest());
    app.use('/users', rest());
    app.use('/actionxuser', rest());
    app.use('/userxapplication', rest());
    
    app.get('/signin', function(req, res, next) {
        
        const email = req.body['email']
        const password = req.body['password']

        const User = userModel(config)

        User.findOne({
            where : {
                email,
                password
            }
        }).then((userdata)=>{
            auth.sign(userdata, process.env.SECRET, (err, token)=>{
                res.status(200).json({
                    token
                });
            })
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