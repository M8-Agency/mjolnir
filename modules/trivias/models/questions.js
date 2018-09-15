const Sequelize = require('sequelize');
module.exports = (db) => {
    return db.define('trivia_questions', {
        question : {
            type: Sequelize.STRING, 
            allowNull: false,
        },    
        points : {
            type: Sequelize.INTEGER(3), 
            allowNull: false,
        },
        extraPoints : {
            type: Sequelize.INTEGER(3), 
            allowNull: true,
        },        
        time : {
            type: Sequelize.INTEGER(3), 
            allowNull: false,
        },
    })
}