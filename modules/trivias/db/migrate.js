require('dotenv').config();
const dbConfig = require('./config');
const Sequelize = require('sequelize');
const Confirm = require('prompt-confirm');

db = new Sequelize(dbConfig)

const usersModel = require('../../users/users.model')(db);
const setModel = require('../models/set')(db);
const questionsModel = require('../models/questions')(db);
const optionsModel = require('../models/options')(db);
const resultsModel = require('../models/results')(db);


setModel.hasMany(questionsModel, { as: 'setId' });
questionsModel.hasMany(optionsModel, { as: 'questionId' });

optionsModel.hasMany(resultsModel, { as: 'optionId' });
usersModel.hasMany(resultsModel, { as: 'userId' });

const confirm = new Confirm(`Migrate ${process.env.DB_DATABASE} on ${process.env.DB_HOST}`).ask((answer) => {
    if (answer) {
        db.sync({
            force: true
        }).then(() => {
            console.log('suceess')
            process.exit(0)
        }).catch((error) => {
            console.log('error', error)
            process.exit(1)
        })
    }
})
