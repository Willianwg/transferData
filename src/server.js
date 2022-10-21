const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path')

const app = express();
const server = http.createServer(app);
const sockets = new Server(server);

const rooms = {};
const usersSpot = {}

function isUserIn(userId, room){
    const user = rooms[room].users.find(item=>item === userId);

    return !!user;
}

function joinUser(userId, room){
    if(isUserIn(userId,room)) return;
    removeUserFromTheLastRoom(userId);

    usersSpot[userId] = room;
    rooms[room].users.push(userId);
    console.log(userId + ' ENTROU NO QUARTO: ' + room );
    getMessage(room);
}

function createRoom(userId, room){
    removeUserFromTheLastRoom(userId);
     rooms[room] = [userId];
     rooms[room] = {
        users:[userId],
        text:''
     }
     usersSpot[userId] = room;
     console.log(userId + ' CRIOU O QUARTO: ' + room );
}

function getMessage(room){
    rooms[room].users.map(id=>{
        sockets.to(id).emit('message', rooms[room].text);
    })
}

function removeUserFromTheLastRoom(userId){
    if(!usersSpot[userId]) return;

    const room = usersSpot[userId]; 

    const index = rooms[room].users.indexOf(userId);
    rooms[room].users.splice(index,1);
    console.log(userId + ' REMOVIDO DO QUARTO: ' + room );
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

    socket.on('disconnect', ()=>{
        removeUserFromTheLastRoom(userId);
    })
})

server.listen(3000);