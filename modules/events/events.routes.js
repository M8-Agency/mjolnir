const Joi = require('joi');
module.exports = (db) => {
    const eventsControllers = require('./events.controller')(db)
    return [
        {
            path: '/api/events',
            method: 'GET',
            handler: eventsControllers.find,
            config: {
                validate : {
                    query : Joi.object().keys({
                        token : Joi.string().required()
                    }),
                }
            }            
        },
        {
            path: '/api/events/{id}',
            method: 'GET',
            handler: eventsControllers.findOne,
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
            path: '/api/events',
            method: 'POST',
            handler: eventsControllers.create            
        },
        {
            path: '/api/events/{id}',
            method: 'PUT',
            handler: eventsControllers.update,
        }, 
        {
            path: '/api/events/{id}',
            method: 'delete',
            handler: eventsControllers.destroy,
        },                        
    ]
}

