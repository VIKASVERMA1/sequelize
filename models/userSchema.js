const { Sequelize, DataTypes } = require("sequelize");
const Address = require("../models/addresses");
const sequelize = require("../connection");
const userData = sequelize.define("userData", {
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  userName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email_id: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
  },
  confirmPassword: {
    type: DataTypes.STRING,
  },
});

userData.beforeSync(() => console.log("before creating the userData table"));
userData.afterSync(() => console.log("before creating the userData table"));

userData.hasMany(Address, { foreignKey: "user_id", as: "address" });
Address.belongsTo(userData, {
  foreignKey: "user_id",
  as: "users",
});

module.exports = userData;
