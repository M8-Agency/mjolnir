const Joi = require('joi');
module.exports = (db) => {
    const triviasControllers = require('./trivias.controller')(db)
    return [
        {
            path: '/api/trivias/set/{code}/questions',
            method: 'GET',
            handler: triviasControllers.questions
        },
        //Retorna el listado de sets jugados o no y la fecha del proximo set
        {
            path: '/api/trivias/set/played/{locale}',
            method: 'GET',
            handler: triviasControllers.played
        },

        //Retorna las trivias jugadas por el usuario
        {
            path: '/api/trivias/set/{code}/enabled',
            method: 'GET',
            handler: triviasControllers.enabled,
        },
        //Retorna las optiones para una pregunta
        {
            path: '/api/trivias/options/{triviaQuestionId}',
            method: 'GET',
            handler: triviasControllers.options
        },
        //Revisar si la respuesta es correcta
        {
            path: '/api/trivias/options/check',
            method: 'POST',
            handler: triviasControllers.check
        },
        //Listado de puntos guardados
        {
            path: '/api/trivias/results',
            method: 'GET',
            handler: triviasControllers.results
        },
        //Sumar puntos extra en un registro
        {
            path: '/api/trivias/results/extra',
            method: 'PUT',
            handler: triviasControllers.extra
        }
    ]
}

