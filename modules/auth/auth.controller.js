require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Sequelize = require("sequelize");

module.exports = db => {
  const userModel = require("../users/users.model")(db);
  const Action = require("../actions/actions.model")(db);

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

  userModel.belongsToMany(Action, {
    through: { model: UserAction, unique: false },
    foreignKey: "userId"
  });
  Action.belongsToMany(userModel, {
    through: { model: UserAction, unique: false },
    foreignKey: "actionId"
  });

  function generateToken(userData) {
    return {
      id: userData.id,
      email: userData.email,
      isAdmin: userData.isAdmin
    };
  }

  return {
    async signup(req, h) {
      try {
        //Encrypt passwod
        if (req.payload) {
          const encryptedPassword = await bcrypt.hash(req.payload.password, 10);
          req.payload.password = encryptedPassword;
          req.payload.isAdmin = false;
        }
        /**IF THERE IS A REFFERED CODE */
        if (req.payload.referred) {
          const refferalUser = await userModel.findOne({
            where: {
              referalCode: req.payload.referred
            }
          });
          /**IF CODE MATCHES A USER */
          if (refferalUser) {
            const refferalAction = await Action.findOne({
              where: {
                code: "REFERRAL"
              }
            });
            const hasRefferedToday = await UserAction.count({
              where: {
                $and: [{ userId: refferalUser.id, actionId: refferalAction.id, valid_score: true }, Sequelize.where(Sequelize.fn("DATE", Sequelize.col("createdAt")), Sequelize.literal("CURRENT_DATE"))]
              }
            });
            await UserAction.create({
              userId: refferalUser.id,
              actionId: refferalAction.id,
              valid_score: hasRefferedToday ? false : true
            });
            req.payload.refererId = refferalUser.id;
          }
        }

        //Save user

        let userData = await userModel.create(req.payload);
        const actionData = await Action.findOne({
          where: {
            code: "REGISTER"
          }
        });
        await UserAction.create({
          userId: userData.id,
          actionId: actionData.id,
          valid_score: true
        });

        //Generate Token to response
        token = await jwt.sign(generateToken(userData), process.env.JWT_KEY);
        return {
          referalCode: userData.referalCode,
          token
        };
      } catch (error) {
        return h
          .response({
            errors: error.errors,
            message: error.message
          })
          .code(400);
      }
    },

    async signin(req, h) {
      try {
        //Find user by email
        let userData = await userModel.findOne({
          where: {
            email: req.payload.email
          }
        });
        if (userData) {
          //compare saved password and input form
          const userValid = await bcrypt.compare(req.payload.password, userData.password);
          if (userValid) {
            token = await jwt.sign(generateToken(userData), process.env.JWT_KEY);
            userData = {
              ...userData.dataValues,
              password: null,
              token
            };
            return userData;
          } else {
            return h
              .response({
                errors: ["Invalid Password"],
                message: "Invalid Password"
              })
              .code(401);
          }
        } else {
          return h
            .response({
              errors: ["User don't exist"],
              message: "User don't exist"
            })
            .code(401);
        }
      } catch (error) {
        return h
          .response({
            errors: error.errors,
            message: error.message
          })
          .code(400);
      }
    },
    async signinemail(req, h) {
      try {
        //Find user by email
        let userData = await userModel.findOne({
          where: {
            email: req.payload.email
          }
        });
        if (userData) {
          //compare saved password and input form
          token = await jwt.sign(generateToken(userData), process.env.JWT_KEY);
          userData = {
            ...userData.dataValues,
            password: null,
            token
          };
          return userData;
        } else {
          return h
            .response({
              errors: ["Email don't exist"],
              message: "Email don't exist"
            })
            .code(401);
        }
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
