const Joi = require('joi');
module.exports = (db) => {
    const applicationsControllers = require('./applications.controller')(db)
    return [
        {
            path: '/api/applications',
            method: 'GET',
            handler: applicationsControllers.find,
            config: {
                validate : {
                    query : Joi.object().keys({
                        token : Joi.string().required()
                    }),
                }
            }            
        },
        {
            path: '/api/applications/{id}',
            method: 'GET',
            handler: applicationsControllers.findOne,
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
            path: '/api/applications',
            method: 'POST',
            handler: applicationsControllers.create,
            config: {
                validate : {
                    query : Joi.object().keys({
                        token : Joi.string().required()
                    }),
                }
            }                   
        },
        {
            path: '/api/applications/{id}',
            method: 'PUT',
            handler: applicationsControllers.update,
            config: {
                validate : {
                    query : Joi.object().keys({
                        token : Joi.string().required()
                    }),
                }
            }             
        }, 
        {
            path: '/api/applications/{id}',
            method: 'delete',
            handler: applicationsControllers.destroy,
            config: {
                validate : {
                    query : Joi.object().keys({
                        token : Joi.string().required()
                    }),
                }
            }             
        },                        
    ]
}

