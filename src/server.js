const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path')

const app = express();
const server = http.createServer(app);
const sockets = new Server(server);

const addresses = {}

app.use( express.static(path.join(__dirname,'public')) );

sockets.on('connection', (socket)=>{
    const userId = socket.id; 
    const userIP = socket.handshake.address;

    addresses[userIP] ? addresses[userIP].push(userId) : addresses[userIP] = [userId];

    console.log('User: ' + userId + ' Entrou com o ip: ' + userIP);
})

server.listen(3000);