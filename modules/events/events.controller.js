require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

module.exports = (db) => {
    const eventsModel = require('./events.model')(db);


    return {
       async find(req, h) {
            try {
                const tokenData = await jwt.verify(req.query.token, process.env.JWT_KEY)
                const eventData = (tokenData.isAdmin) ? await eventsModel.findAll() : await eventsModel.findById(tokenData.id)  
                return eventData;
            } catch (error) {
                return h.response({
                    "errors": error.errors,
                    "message": error.message
                }).code(400)
            }
        },

        async findOne(req, h) {
            try {
                const tokenData = await jwt.verify(req.query.token, process.env.JWT_KEY)
                const targetId = (tokenData.isAdmin) ? req.params.id : tokenData.id;
                const eventData = await eventsModel.findById(targetId);
                return eventData
            } catch (error) {
                return h.response({
                    "errors": error.errors,
                    "message": error.message
                }).code(400)
            }
        },

        async create(req, h) {
            try {
                const eventData = await eventsModel.create(req.payload);
                if (eventData) {
                    return response
                }
            } catch (error) {
                return h.response({
                    "errors": error.errors,
                    "message": error.message
                }).code(400)
            }
        },

        async update(req, h) {
            try {
                const tokenData = await jwt.verify(req.query.token, process.env.JWT_KEY)
                const targetId = (tokenData.isAdmin) ? req.params.id : tokenData.id;                
                const eventData = await eventsModel.update(
                    req.payload,
                    {
                        where: {
                            id: targetId
                        }
                    }
                )
                return eventData
            } catch (error) {
                return h.response({
                    "errors": error.errors,
                    "message": error.message
                }).code(400)
            }
        },

        async destroy(req, h) {
            try {
                const tokenData = await jwt.verify(req.query.token, process.env.JWT_KEY)
                const targetId = (tokenData.isAdmin) ? req.params.id : tokenData.id;                    
                const eventData = await eventsModel.destroy({
                    where: {
                        id: targetId
                    }
                })
                return eventData;
            } catch (error) {
                return h.response({
                    "errors": error.errors,
                    "message": error.message
                }).code(400)
            }
        },
    }

}