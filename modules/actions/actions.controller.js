require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const moment = require("moment");
const Sequelize = require("sequelize");
const Mailer = require("../../mailer");
const tools = require("./actions.tools");

module.exports = db => {
  const User = require("../users/users.model")(db);
  const Action = require("./actions.model")(db);

  const UserAction = db.define("user_action", {
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

  User.belongsToMany(Action, {
    through: { model: UserAction, unique: false },
    foreignKey: "userId"
  });
  Action.belongsToMany(User, {
    through: { model: UserAction, unique: false },
    foreignKey: "actionId"
  });

  const isValid = (count, limit, max, total, canPostWithoutPoints) => {
    let valid = false;
    let points = false;
    if (count >= limit) {
      if (canPostWithoutPoints) {
        valid = true;
        points = false;
      } else {
        valid = false;
        points = false;
      }
    } else {
      if (total >= max) {
        if (canPostWithoutPoints) {
          valid = true;
          points = false;
        } else {
          valid = false;
          points = false;
        }
      } else {
        valid = true;
        points = true;
      }
    }
    return {
      valid,
      points
    };
  };

  async function validate(userId, action) {
    try {
      let actions;
      if (action.frequency === "unique") {
        actions = await UserAction.count({
          where: { userId: userId, actionId: action.id, valid_score: true }
        });
        return isValid(actions, action.frequency_limit, action.max_actions, actions, action.can_pass_limit);
      } else {
        actions = await UserAction.count({
          where: {
            $and: [{ userId: userId, actionId: action.id, valid_score: true }, Sequelize.where(Sequelize.fn("DATE", Sequelize.col("createdAt")), Sequelize.literal("CURRENT_DATE"))]
          }
        });
      }
      const total = await UserAction.count({
        where: { userId: userId, actionId: action.id, valid_score: true }
      });

      return isValid(actions, action.frequency_limit, action.max_actions, total, action.can_pass_limit);
    } catch (error) {
      return {
        valid: false,
        points: false
      };
    }
  }

  return {
    async points(req, h) {
      try {
        const tokenData = await jwt.verify(req.query.token, process.env.JWT_KEY);
        const actionsData = Action.findAll({
          where: {
            userId: tokenData.id,
            valid: true
          },
          order: [["createdAt", "ASC"]]
        });
        return actionsData;
      } catch (error) {
        return h
          .response({
            errors: error.errors,
            message: error.message
          })
          .code(400);
      }
    },

    async find(req, h) {
      try {
        const tokenData = await jwt.verify(req.query.token, process.env.JWT_KEY);
        const actionsData = Action.findAll({
          where: {
            userId: tokenData.id
          },
          order: [["createdAt", "ASC"]]
        });
        return actionsData;
      } catch (error) {
        return h
          .response({
            errors: error.errors,
            message: error.message
          })
          .code(400);
      }
    },

    async findCode(req, h) {
      try {
        const tokenData = await jwt.verify(req.query.token, process.env.JWT_KEY);
        const actionsData = Action.findAll({
          where: {
            userId: tokenData.id,
            code: req.params.code
          },
          order: [["createdAt", "ASC"]]
        });
        return actionsData;
      } catch (error) {
        return h
          .response({
            errors: error.errors,
            message: error.message
          })
          .code(400);
      }
    },

    async create(req, h) {
      try {
        const tokenData = await jwt.verify(req.payload.token, process.env.JWT_KEY);
        /**PREVENT STICKER ACTIONS TO BE FIRED FROM HERE */
        const invalidActions = ["PALMERA", "SUN", "AMOR", "DRINK", "BALL", "BUCKET", "CARNAVAL", "FOOD", "DIVE", "BOAT"];
        if (invalidActions.indexOf(req.payload.code) > -1) {
          return h
            .response({
              errors: "",
              message: "Action not allowed"
            })
            .code(501);
        }
        const actionData = await Action.findOne({
          where: {
            code: req.payload.code
          }
        });
        //Error en caso de pasar mal el event code
        if (!actionData) {
          return h
            .response({
              errors: [`Action ${req.payload.code} don't exist`],
              message: `Action ${req.payload.code} don't exist`
            })
            .code(400);
        }

        const validity = await validate(tokenData.id, actionData);
        if (!validity.valid) {
          return h
            .response({
              errors: "",
              message: "The limit for this has been reached"
            })
            .code(501);
        }
        const useration = await UserAction.create({
          userId: tokenData.id,
          actionId: actionData.id,
          picture: req.payload.picture || null,
          valid_score: validity.points,
          share_platform: req.payload.share_platform || null
        });
        // const userAction = await userData.setActions(actionData, {
        //   through: { picture: req.payload.picture || null, valid_score: 1 }
        // });

        return useration;

        // const data = {
        //   picture: req.payload.picture || null,
        //   valid_score: 1, //TODO: VALIDATE if is valid
        //   userId: tokenData.id,
        //   actionId: actionData.id
        // };

        // const actionsbyuser = await Action.findAll({
        //   where: {
        //     userId: req.payload.userId ? req.payload.userId : tokenData.id,
        //     eventId: eventData.id,
        //     valid: true
        //   },
        //   order: [["createdAt", "ASC"]]
        // });

        // const isValid = tools.validateAction(eventData, actionsbyuser);
        // const pointsToSave = req.payload.points
        //   ? req.payload.points
        //   : eventData.points;

        // const dataToSave = {
        //   userId: req.payload.userId ? req.payload.userId : tokenData.id,
        //   eventId: eventData.id,
        //   code: req.payload.code,
        //   category: req.payload.category,
        //   event: req.payload.event,
        //   utm: req.payload.utm,
        //   url: req.payload.url,
        //   image: req.payload.image,
        //   points: pointsToSave,
        //   valid: isValid,
        //   primaryJson: req.payload.primaryJson,
        //   secondayJson: req.payload.secondayJson
        // };

        // const actionData = await Action.create(dataToSave);
        // if (actionData) {
        //   //Send email if emailConfig is present

        //   if (req.payload.emailConfig) {
        //     const emailConfig = req.payload.emailConfig;
        //     Mailer.send(
        //       emailConfig.to,
        //       emailConfig.subject,
        //       emailConfig.html,
        //       emailConfig.data
        //     );
        //   }

        //   return actionData;
        // }
      } catch (error) {
        return h
          .response({
            errors: error.errors,
            message: error.message
          })
          .code(400);
      }
    }
  };
};
