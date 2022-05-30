const dbConfig=require('./config/dbconfig');
const {Sequelize,DataTypes}=require('sequelize');

const sequelize=new Sequelize(
    dbConfig.DB,
    dbConfig.USER,
    dbConfig.PASSWORD,{
        host:dbConfig.HOST,
        dialect:dbConfig.dialect,
        operatorsAliases:false,

        pool:{
            max:dbConfig.pool.max,
            min:dbConfig.pool.min,
        }
    }
)

sequelize.authenticate().then(()=>{
    console.log('Database Connected..')
}).catch(err=>{
    console.log('Error'+err)
})

const db={}


db.Sequelize=Sequelize
db.sequelize=sequelize



sequelize.sync({force:false}).then(()=>{
    console.log('Yes re-sync done')
})



module.exports = sequelize