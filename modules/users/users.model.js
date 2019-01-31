const Sequelize = require("sequelize");

function makeid() {
  var text = "";
  var possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 20; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}
module.exports = db => {
  return db.define("user", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      unique: true
    },
    firstname: {
      type: Sequelize.STRING(64),
      allowNull: false
    },
    lastname: {
      type: Sequelize.STRING(64),
      allowNull: false
    },
    email: {
      type: Sequelize.STRING(64),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    username: {
      type: Sequelize.STRING(64),
      allowNull: false
    },
    password: {
      type: Sequelize.STRING(64),
      allowNull: false
    },
    city: {
      type: Sequelize.STRING(32),
      allowNull: true
    },
    country: {
      type: Sequelize.STRING(32),
      allowNull: true
    },
    birthday: {
      type: Sequelize.DATEONLY,
      allowNull: true,
      validate: {
        isDate: true
      }
    },
    phone: {
      type: Sequelize.STRING(64),
      allowNull: true
    },
    refererId: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
      allowNull: true
    },
    referalCode: {
      type: Sequelize.STRING,
      defaultValue: makeid(),
      allowNull: false
    },
    utm: {
      type: Sequelize.STRING,
      allowNull: true
    },
    news: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      allowNull: true
    },
    idAdmin: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      allowNull: false
    }
  });
};
