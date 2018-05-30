const express = require('express')
const app = express.Router()
const bodyParser = require('body-parser');
const usersRouter = require('./rest/users');
const visionRouter = require('./rest/vision');
const applicationsRouter = require('./rest/applications');
const actionsRouter = require('./rest/actions');
const authRouter = require('./rest/auth');


module.exports = () => {
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({ extended: true }))
    //ROUTES
    app.use('/actions', actionsRouter());
    app.use('/applications', applicationsRouter());
    app.use('/auth', authRouter());
    app.use('/users', usersRouter());
    app.use('/vision', visionRouter());

    app.use((err, req, res, next) => {
        res.status(500).send({ 
          error : true,
          message : err.message,
          code : err.code
      })
    })    

    
    return app
}