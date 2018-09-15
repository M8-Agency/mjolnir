const Joi = require('joi');
module.exports = (db) => {
    const usersControllers = require('./users.controller')(db)
    return [
        {
            path: '/api/users',
            method: 'GET',
            handler: usersControllers.find,
            config: {
                validate : {
                    query : Joi.object().keys({
                        token : Joi.string().required()
                    }),
                }
            }            
        },
        {
            path: '/api/users/{id}',
            method: 'GET',
            handler: usersControllers.findOne,
            config: {
                validate : {
                    params : Joi.object().keys({
                        id : Joi.number().required()
                    }),
                    query : Joi.object().keys({
                        token : Joi.string().required()
                    }),
                }
            }
        },
        {
            path: '/api/users',
            method: 'POST',
            handler: usersControllers.create            
        },
        {
            path: '/api/users/{id}',
            method: 'PUT',
            handler: usersControllers.update,
            config: {
                validate : {
                    query : Joi.object().keys({
                        token : Joi.string().required()
                    }),
                }
            }            
        }, 
        {
            path: '/api/users/{id}',
            method: 'delete',
            handler: usersControllers.destroy,
        },                        
    ]
}

