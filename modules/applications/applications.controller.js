require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

module.exports = (db) => {
    const eventsModel = require('./applications.model')(db);
    return {
        async find(req, h) {
            try {
                const tokenData = await jwt.verify(req.query.token, process.env.JWT_KEY)
                if (tokenData.isAdmin) {
                    const applicationData = await eventsModel.findAll();
                    return applicationData;
                } else {
                    return h.response({
                        "errors": "unauthorized token",
                        "message": "unauthorized token"
                    }).code(401)
                }

            } catch (error) {
                return h.response({
                    "errors": error.errors,
                    "message": error.message
                }).code(400);
            }
        },

        async findOne(req, h) {
            try {
                const tokenData = await jwt.verify(req.query.token, process.env.JWT_KEY)
                if (tokenData.isAdmin) {
                    const applicationData = await eventsModel.findById(req.params.id);
                    return applicationData
                } else {
                    return h.response({
                        "errors": "unauthorized token",
                        "message": "unauthorized token"
                    }).code(401);
                }

            } catch (error) {
                return h.response({
                    "errors": error.errors,
                    "message": error.message
                }).code(400)
            }
        },

        async create(req, h) {
            try {
                const tokenData = await jwt.verify(req.query.token, process.env.JWT_KEY)
                if (tokenData.isAdmin) {
                    const applicationData = await eventsModel.create(req.payload);
                    if (applicationData) {
                        return applicationData
                    }
                } else {
                    return h.response({
                        "errors": "unauthorized token",
                        "message": "unauthorized token"
                    }).code(401);
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
                if (tokenData.isAdmin) {
                    const applicationData = await eventsModel.update(
                        req.payload,
                        {
                            where: {
                                id: req.params.id
                            }
                        }
                    )
                    return applicationData
                } else {
                    return h.response({
                        "errors": "unauthorized token",
                        "message": "unauthorized token"
                    }).code(401);
                }

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
                if (tokenData.isAdmin) {
                    const applicationData = await eventsModel.destroy({
                        where: {
                            id: req.params.id
                        }
                    })
                    return applicationData;
                } else {
                    return h.response({
                        "errors": "unauthorized token",
                        "message": "unauthorized token"
                    }).code(401);
                }
            } catch (error) {
                return h.response({
                    "errors": error.errors,
                    "message": error.message
                }).code(400)
            }
        },
    }

}