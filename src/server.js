require('dotenv').config();

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path')
const cors = require('cors');
const multer = require('multer');
const uploadConfig = require('./config/upload.js');
const upload = multer(uploadConfig);
const websockets = require('./sockets.js');

const app = express();
app.use(cors());
app.use(express.json())

const server = http.createServer(app);
const sockets = new Server(server);
websockets(sockets);

app.use( express.static(path.join(__dirname,'public')) );

app.post("/upload", upload.single("image"),(req,res)=>{
    return res.status(200).json({ message: "Your image has been uploaded!"});
})

server.listen(process.env.PORT || 3000);