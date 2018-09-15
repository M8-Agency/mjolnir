const Sequelize = require('sequelize');
module.exports = (db) => {
    return db.define('applications', {
        name : {
            type: Sequelize.STRING, 
            allowNull: false,
        },
        description : {
            type: Sequelize.STRING, 
            allowNull: true,
        }        
    })
}