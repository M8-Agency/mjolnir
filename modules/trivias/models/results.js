const Sequelize = require('sequelize');
module.exports = (db) => {
    return db.define('trivia_results', {
        userId: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        triviaQuestionId : {
            type: Sequelize.INTEGER, 
            allowNull: false,
        },        
        triviaOptionId: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        startTime: {
            type: Sequelize.BIGINT,
            allowNull: false,
        },
        endTime: {
            type: Sequelize.BIGINT,
            allowNull: false,
        },
        elapsedTime: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        correct: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
        },
        points: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        extraPoints: {
            type: Sequelize.INTEGER,
            allowNull: true,
        },
        setCode: {
            type: Sequelize.STRING(16),
            allowNull: false,
        },
        description: {
            type: Sequelize.STRING(64),
            allowNull: true,
        },
    }, {
            indexes: [
                {
                    unique: true,
                    fields: ['userId', 'triviaOptionId']
                }
            ]
        })
}