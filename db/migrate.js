require("dotenv").config();
const dbConfig = require("./config");
const Sequelize = require("sequelize");
const Confirm = require("prompt-confirm");

db = new Sequelize(dbConfig);

const eventsModel = db.define("user_action", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    unique: true
  },
  picture: Sequelize.STRING,
  valid_score: Sequelize.BOOLEAN
});

// const applicationsModel = require('../modules/applications/applications.model')(db);
// const eventsModel = require("../modules/events/events.model")(db);
const usersModel = require("../modules/users/users.model")(db);
// const eventsModel = require('../modules/events/events.model')(db);
const actionsModel = require("../modules/actions/actions.model")(db);
// const emailsModel = require('../modules/emails/emails.model')(db);

// usersModel.hasMany(actionsModel, { as: 'userId' });
// eventsModel.hasMany(actionsModel, { as: 'eventId' });

// applicationsModel.hasMany(eventsModel, { as: 'applicationId' });
// applicationsModel.hasMany(emailsModel, { as: 'applicationId2' });

usersModel.belongsToMany(actionsModel, {
  through: { model: eventsModel, unique: false },
  foreignKey: "userId"
});
actionsModel.belongsToMany(usersModel, {
  through: { model: eventsModel, unique: false },
  foreignKey: "actionId"
});

console.log(dbConfig);

const confirm = new Confirm(`Migrate ${process.env.DB_DATABASE} on ${process.env.DB_HOST}`).ask(answer => {
  if (answer) {
    db.sync({
      force: true
    })
      .then(() => {
        console.log("suceess");
        actionsModel
          .bulkCreate([
            { name: "Register", code: "REGISTER", description: "Register a user", points: 15, frequency: "unique", frequency_limit: 1, max_actions: 1, can_pass_limit: false },
            { name: "Upload", code: "UPLOAD", description: "Upload an image", points: 1, frequency: "daily", frequency_limit: 1, max_actions: 10, can_pass_limit: false },
            { name: "Share", code: "SHARE", description: "Share a post", points: 5, frequency: "daily", frequency_limit: 3, max_actions: 99999999, can_pass_limit: true }
          ])
          .then(() => {
            process.exit(0);
          });
      })
      .catch(error => {
        console.log("error", error);
        process.exit(1);
      });
  }
});
