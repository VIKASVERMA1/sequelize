const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../connection')
    const passwordAccessToken=sequelize.define("passwordAccessToken",{
        password_Access_Token:{
            type:DataTypes.STRING,
            allowNull:false
        }
    })

    passwordAccessToken.sync()
module.exports = passwordAccessToken