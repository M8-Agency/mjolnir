require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

module.exports = (db) => {
    const triviaSetsModel = require('./models/set')(db);
    const triviaQuestionsModel = require('./models/questions')(db);
    const triviaOptionsModel = require('./models/options')(db);
    const triviaResultsModel = require('./models/results')(db);

    const findResultToSet = async (userId, setCode) => {
        try {
            const resultsData = await triviaResultsModel.findAll({
                raw: true,
                where: {
                    userId,
                    setCode
                }
            })
            return (resultsData.length === 0)
        } catch (error) {
            return error.message
        }

    }

    const getOptionsByQuestion = async (triviaQuestionId) => {
        try {
            const optionsData = await triviaOptionsModel.findAll({
                raw: true,
                attributes: [
                    'id',
                    'option',
                    'triviaQuestionId',
                ],                
                where: {
                    triviaQuestionId
                }
            })
            return optionsData
        } catch (error) {
            return error.message
        }

    }    

    return {
        async questions(req, h) {
            try {
                //const tokenData = await jwt.verify(req.query.token, process.env.JWT_KEY)
                const setData = await triviaSetsModel.find({
                    where: {
                        code: req.params.code
                    }
                })

                const optionsData = await triviaQuestionsModel.findAll(
                    {
                        where: {
                            triviaSetId: setData.id
                        },
                        order: [
                            ['id', 'ASC']
                        ]
                    }
                );
                return optionsData;
            } catch (error) {
                return h.response({
                    "errors": error.errors,
                    "message": error.message
                }).code(400)
            }
        },
        async played(req, h) {
            try {
                const tokenData = await jwt.verify(req.query.token, process.env.JWT_KEY);
                const setData = await triviaSetsModel.findAll({
                    raw: true,
                    where : {
                        locale : req.params.locale
                    },
                    order: [
                        ['id', 'ASC']
                    ]                    
                })

                const results = setData.map(async (item) => {
                    item.canPlay = await findResultToSet(tokenData.id, item.code)
                    return item
                })
                
                const render = await Promise.all(results)
                return render

            } catch (error) {
                return h.response({
                    "errors": error.errors,
                    "message": error.message
                }).code(400)
            }
        },
        async enabled(req, h) {

            const tokenData = await jwt.verify(req.query.token, process.env.JWT_KEY);
            //Busco el id del set
            const setData = await triviaSetsModel.find({
                where: {
                    code: req.params.code
                }
            })
            //Busco las preguntas del set
            const questionsData = await triviaQuestionsModel.findAll({
                raw : true,
                where: {
                    triviaSetId: setData.id
                },
                order: [
                    ['id', 'ASC']
                ]
            })

            //Busco si respondió preguntas para este set
            let enabled = false;
            const resultsData = await triviaResultsModel.findAndCountAll({
                where: {
                    userId: tokenData.id,
                    setCode: req.params.code
                }
            })

            const results = questionsData.map(async (item, index)=>{
                item['options'] = await getOptionsByQuestion(item.id)
                return item
                
            })

            const renderQuestionsData = await Promise.all(results)            

            if (resultsData.count === 0) {
                return h.response(renderQuestionsData).code(200);
            } else {
                return h.response({
                    "disabled": true
                }).code(200);
            }

        },
        async options(req, h) {
            try {
                //const tokenData = await jwt.verify(req.query.token, process.env.JWT_KEY)

                const optionsData = await triviaOptionsModel.findAll(
                    {
                        attributes: [
                            'id',
                            'option',
                            'triviaQuestionId'
                        ],
                        where: {
                            triviaQuestionId: req.params.triviaQuestionId
                        },
                        order: [
                            ['id', 'ASC']
                        ]
                    }
                );
                return optionsData;
            } catch (error) {
                return h.response({
                    "errors": error.errors,
                    "message": error.message
                }).code(400)
            }
        },
        async check(req, h) {
            try {
                const tokenData = await jwt.verify(req.query.token, process.env.JWT_KEY)

                const optionsData = await triviaOptionsModel.find(
                    {
                        where: {
                            id: req.payload.triviaOptionId
                        }
                    }
                );

                //busco los datos de la pregunta para obtener los puntos a guardar
                const questionsData = await triviaQuestionsModel.find(
                    {
                        where: {
                            id: req.payload.triviaQuestionId
                        }
                    }
                );

                let resultToSave = {
                    userId: tokenData.id,
                    startTime: req.payload.startTime,
                    endTime: req.payload.endTime,
                    elapsedTime: (req.payload.endTime - req.payload.startTime),
                    triviaQuestionId: req.payload.triviaQuestionId,
                    triviaOptionId: req.payload.triviaOptionId,
                    setCode: req.payload.setCode
                }

                //En caso de recibir status es una respuesta automatica para timeouts u otra interacción
                if (req.payload.status) {
                    resultToSave = {
                        ...resultToSave,
                        correct: false,
                        points: 0,
                        extraPoints: 0,
                        description: req.payload.status,
                    }
                } else {
                    resultToSave = {
                        ...resultToSave,
                        correct: optionsData.correct,
                        points: (optionsData.correct) ? questionsData.points : 0,
                        extraPoints: (req.payload.extraPoints && optionsData.correct) ? req.payload.extraPoints : 0,
                        description: req.payload.description
                    }
                }



                const resultData = await triviaResultsModel.create(resultToSave)

                return resultData;

            } catch (error) {
                return h.response({
                    "errors": error.errors,
                    "message": error.message
                }).code(400)
            }
        },
        async extra(req, h) {
            try {
                const tokenData = await jwt.verify(req.query.token, process.env.JWT_KEY)

                const extraData = await triviaResultsModel.update(
                    {
                        extraPoints: req.payload.extraPoints
                    },
                    {
                        where: {
                            id: req.payload.id,
                            userId: tokenData.id
                        }
                    }
                )

                return extraData;
            } catch (error) {
                return h.response({
                    "errors": error.errors,
                    "message": error.message
                }).code(400)
            }
        },
        async results(req, h) {
            try {
                const tokenData = await jwt.verify(req.query.token, process.env.JWT_KEY)

                const extraData = await triviaResultsModel.findAll({
                    where: {
                        userId: tokenData.id
                    }
                })

                return extraData;
            } catch (error) {
                return h.response({
                    "errors": error.errors,
                    "message": error.message
                }).code(400)
            }
        }
    }
}