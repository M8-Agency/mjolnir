const Joi = require('joi');
module.exports = (db) => {
    const actionsControllers = require('./actions.controller')(db)
    return [
        {
            path: '/api/actions',
            method: 'GET',
            handler: actionsControllers.find,
        },
        {
            path: '/api/actions/points',
            method: 'GET',
            handler: actionsControllers.points,
        },        
        {
            path: '/api/actions/{code}',
            method: 'GET',
            handler: actionsControllers.findCode,
        },        
        {
            path: '/api/actions',
            method: 'POST',
            handler: actionsControllers.create,
            config: {
                validate : {
                    /*
                    payload : Joi.object().keys({
                        code : Joi.string().required()
                    }),
                    */
                    query : Joi.object().keys({
                        token : Joi.string().required()
                    }),
                }
            }            
        },
        
    ]
}

