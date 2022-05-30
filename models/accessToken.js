const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../connection')
    const access_Token=sequelize.define("accessToken",{
        user_id:{
            type:DataTypes.STRING,
            allowNull:false
        },
        access_token:{
            type:DataTypes.STRING,
            allowNull:false
        },
    })

    access_Token.sync()
module.exports = access_Token