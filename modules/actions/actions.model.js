const Sequelize = require("sequelize");
module.exports = db => {
  return db.define("actions", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      unique: true
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    code: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    },
    description: {
      type: Sequelize.STRING,
      allowNull: false
    },
    points: {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    frequency: {
      type: Sequelize.STRING(12),
      allowNull: false,
      validate: {
        isIn: [["unique", "daily"]]
      }
    },
    frequency_limit: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    max_actions: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    can_pass_limit: {
      type: Sequelize.BOOLEAN,
      defaultValue: true
    }
  });
};
