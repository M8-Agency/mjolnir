require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const Mailer = require('../../mailer');
const tools = require('./actions.tools');

module.exports = (db) => {
    const eventsModel = require('../events/events.model')(db);
    const actionsModel = require('./actions.model')(db);

    return {

        async points(req, h) {
            try {
                const tokenData = await jwt.verify(req.query.token, process.env.JWT_KEY);
                const actionsData = actionsModel.findAll({
                    where: {
                        userId: tokenData.id,
                        valid : true
                    },
                    order: [
                        ['createdAt', 'ASC']
                    ]
                });
                return actionsData;
            } catch (error) {
                return h.response({
                    "errors": error.errors,
                    "message": error.message
                }).code(400)
            }
        },        

        async find(req, h) {
            try {
                const tokenData = await jwt.verify(req.query.token, process.env.JWT_KEY);
                const actionsData = actionsModel.findAll({
                    where: {
                        userId: tokenData.id
                    },
                    order: [
                        ['createdAt', 'ASC']
                    ]
                });
                return actionsData;
            } catch (error) {
                return h.response({
                    "errors": error.errors,
                    "message": error.message
                }).code(400)
            }
        },

        async findCode(req, h) {
            try {
                const tokenData = await jwt.verify(req.query.token, process.env.JWT_KEY);
                const actionsData = actionsModel.findAll({
                    where: {
                        userId: tokenData.id,
                        code: req.params.code
                    },
                    order: [
                        ['createdAt', 'ASC']
                    ]
                });
                return actionsData;
            } catch (error) {
                return h.response({
                    "errors": error.errors,
                    "message": error.message
                }).code(400)
            }
        },
        async create(req, h) {
            try {
                const tokenData = await jwt.verify(req.query.token, process.env.JWT_KEY);

                const eventData = await eventsModel.findOne({
                    where: {
                        code: req.payload.code
                    }
                });
                //Error en caso de pasar mal el event code
                if(!eventData){
                    return h.response({
                        "errors": [`Event ${req.payload.code} don't exist`],
                        "message": `Event ${req.payload.code} don't exist`
                    }).code(400)
                }

                const actionsbyuser = await actionsModel.findAll({
                    where: {
                        userId: (req.payload.userId) ? req.payload.userId : tokenData.id,
                        eventId: eventData.id,
                        valid: true
                    },
                    order: [
                        ['createdAt', 'ASC']
                    ]
                })

                const isValid = tools.validateAction(eventData, actionsbyuser);
                const pointsToSave = (req.payload.points) ? req.payload.points : eventData.points;

                const dataToSave = {
                    userId: (req.payload.userId) ? req.payload.userId : tokenData.id,
                    eventId: eventData.id,
                    code: req.payload.code,
                    category: req.payload.category,
                    event: req.payload.event,
                    utm: req.payload.utm,
                    url: req.payload.url,
                    image: req.payload.image,
                    points: pointsToSave,
                    valid: isValid,
                    primaryJson: req.payload.primaryJson,
                    secondayJson: req.payload.secondayJson
                }

                const actionData = await actionsModel.create(dataToSave);
                if (actionData) {
                    //Send email if emailConfig is present

                    if (req.payload.emailConfig) {
                        const emailConfig = req.payload.emailConfig
                        Mailer.send(emailConfig.to, emailConfig.subject, emailConfig.html, emailConfig.data);
                    }

                    return actionData
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