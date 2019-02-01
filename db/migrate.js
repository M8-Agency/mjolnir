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
  valid_score: Sequelize.BOOLEAN,
  share_platform: Sequelize.STRING
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
            { name: "Newsletter", code: "NEWSLETTER", description: "Newsletter subscription", points: 15, frequency: "unique", frequency_limit: 1, max_actions: 1, can_pass_limit: false },
            { name: "Palmera Sticker", code: "PALMERA", description: "Palmera Sticker", points: 10, frequency: "daily", frequency_limit: 1, max_actions: 10, can_pass_limit: false },
            { name: "Sol Sticker", code: "SUN", description: "Sol Sticker", points: 15, frequency: "daily", frequency_limit: 1, max_actions: 10, can_pass_limit: false },
            { name: "Amor Sticker", code: "AMOR", description: "Amor Sticker", points: 20, frequency: "daily", frequency_limit: 1, max_actions: 10, can_pass_limit: false },
            { name: "Bebida Sticker", code: "DRINK", description: "Bebida Sticker", points: 25, frequency: "daily", frequency_limit: 1, max_actions: 10, can_pass_limit: false },
            { name: "Ball Sticker", code: "BALL", description: "Ball Sticker", points: 30, frequency: "daily", frequency_limit: 1, max_actions: 10, can_pass_limit: false },
            { name: "Bucket Sticker", code: "BUCKET", description: "Bucket Sticker", points: 35, frequency: "daily", frequency_limit: 1, max_actions: 10, can_pass_limit: false },
            { name: "Carnaval Sticker", code: "CARNAVAL", description: "Carnaval Sticker", points: 40, frequency: "daily", frequency_limit: 1, max_actions: 10, can_pass_limit: false },
            { name: "Comida Sticker", code: "FOOD", description: "Comida Sticker", points: 45, frequency: "daily", frequency_limit: 1, max_actions: 10, can_pass_limit: false },
            { name: "Buceo Sticker", code: "DIVE", description: "Buceo Sticker", points: 50, frequency: "daily", frequency_limit: 1, max_actions: 10, can_pass_limit: false },
            { name: "Velero Sticker", code: "BOAT", description: "Velero Sticker", points: 55, frequency: "daily", frequency_limit: 1, max_actions: 10, can_pass_limit: false },
            { name: "Refer a friend", code: "REFERRAL", description: "Refer a friend", points: 5, frequency: "daily", frequency_limit: 1, max_actions: 30, can_pass_limit: true },
            { name: "Compra 1 ticket", code: "BUYONE", description: "Compra 1 ticket", points: 15, frequency: "unique", frequency_limit: 1, max_actions: 1, can_pass_limit: false },
            { name: "Compra 2 ticket", code: "BUYTWO", description: "Compra 2 ticket", points: 20, frequency: "unique", frequency_limit: 1, max_actions: 1, can_pass_limit: false },
            { name: "Compra 3 ticket", code: "BUYTHREE", description: "Compra 3 ticket", points: 25, frequency: "unique", frequency_limit: 1, max_actions: 1, can_pass_limit: false },
            { name: "Compra 4 ticket", code: "BUYFOUR", description: "Compra 4 ticket", points: 30, frequency: "unique", frequency_limit: 1, max_actions: 1, can_pass_limit: false },
            { name: "Compra 5+ ticket", code: "BUYMORE", description: "Compra 5+ ticket", points: 35, frequency: "unique", frequency_limit: 1, max_actions: 1, can_pass_limit: false },
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
