const express=require('express')
const app=express()
const http=require('http')
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const PORT= 3000

server.listen(PORT,()=>{
    console.log(`Listening on port no. ${PORT}`);
})

app.use(express.static(__dirname + '/public'))

app.get('/',(req,res)=>{
    res.sendFile(__dirname +'/index.html')
})


//socket

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('message',(msg)=>{
    socket.broadcast.emit('message',msg)
})
  });




