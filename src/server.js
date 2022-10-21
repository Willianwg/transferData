const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path')

const app = express();
const server = http.createServer(app);
const sockets = new Server(server);

const rooms = {};
let txt = {}


function isUserIn(userId, room){
    const user = rooms[room].users.find(item=>item === userId);

    return !!user;
}

function joinUser(userId, room){
    if(isUserIn(userId,room)) return;

    rooms[room].users.push(userId);
    getMessage(room);
}

function createRoom(userId, room){
     rooms[room] = [userId];

     rooms[room] = {
        users:[userId],
        text:''
     }
}

function getMessage(room){
    rooms[room].users.map(id=>{
        sockets.to(id).emit('message', rooms[room].text);
    })
}

app.use( express.static(path.join(__dirname,'public')) );

sockets.on('connection', (socket)=>{
    const userId = socket.id; 
    const userIP = socket.handshake.address;

    console.log('User: ' + userId + ' Entrou com o ip: ' + userIP);

    socket.on('transferData', (roomData)=>{
        const { room, text } = roomData;
        rooms[room].text = text;

        getMessage(room);
    })

    socket.on('join', (room)=>{
        console.log(room)
        rooms[room] ? joinUser(userId, room) : createRoom(userId, room);
        console.log(rooms[room])
    })

})

server.listen(3000);