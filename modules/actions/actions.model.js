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
    limit: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    max: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0
    }
  });
};
