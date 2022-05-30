const express=require('express')
const cors=require('cors')
require("./connection")
const fileUpload=require("express-fileupload")
require("./emailTransporter/emailTransporter")

const app=express()
var corsOptions={
    origin:'https://localhost:8081'
}

app.use(fileUpload({
    useTempFiles:true,
    tempFileDir:'uploads/'
}))


//middlewares

app.use(cors(corsOptions))
app.use(express.json())
app.use(express.urlencoded({extended:true}))


//router

const router=require('./routes/userRoutes')

app.use('/user',router)


//testing api

app.get('/',(res,req)=>{
res.json({message:"hello Dear"})
})

//port

const PORT=process.env.PORT||2022

//server

app.listen(PORT,()=>{
    console.log(`Your server is runnig on ${PORT}`)
})