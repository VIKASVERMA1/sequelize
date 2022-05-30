const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../connection');
const userData = require('./userSchema');
    const Address=sequelize.define("address",{
        user_id:{
            type:DataTypes.STRING,
            allowNull:false
        },
        user_city:{
            type:DataTypes.STRING,
            allowNull:false
        },
        user_state:{
            type:DataTypes.STRING,
            allowNull:false
        },
        user_pincode:{
            type:DataTypes.STRING,
            allowNull:false
        },
        user_phoneNo:{
            type:DataTypes.STRING,
            allowNull:false
        },
    })

    Address.beforeSync(()=>console.log('before creating the Address table'));
    Address.afterSync(()=>console.log('before creating the Address table'));
   

module.exports = Address