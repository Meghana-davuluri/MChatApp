const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages')
const { userJoin, getCurrentUser,userLeave,getRoomUsers } = require('./utils/users')



const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://srikanth:<password>@cluster.akeoz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
});

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(path.join(__dirname, 'public')));

const botName = "chat App";

//Run when client connects
io.on('connection', socket => {
    socket.on('joinRoom', ({username, password})=>{
        const user = userJoin(socket.id, username, password);

        socket.join(user.password);

        //welcome to current user
    socket.emit('message', formatMessage(botName,'Welcome to chat application!'));

    //Broadcast when a user connects
    socket.broadcast.to(user.password).emit('message', formatMessage(botName, 'A user has joined the chat' ));

    })
   




    
    //Listen for chat Message
    socket.on('chatMessage',msg=> {
        const user = getCurrentUser(socket.id);
        io.to(user.password).emit('message', formatMessage(user.username, msg));
    })

    //Runs when client disconnects
    socket.on('disconnect',()=>{
        const user = userLeave(socket.id);
        if(user){

        io.to(user.password).emit('message', formatMessage(botName, `${user.username} has left the chat`));
        }
    });


    
});

const PORT = 3000 ||  process.env.PORT;

server.listen(PORT, ()=> console.log(`server running on Port ${PORT}`));