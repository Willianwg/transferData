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
const deleteImage = require("./deleteImage");

const app = express();
app.use(cors());
app.use(express.json())

const server = http.createServer(app);
const sockets = new Server(server);
websockets(sockets);

app.use( express.static(path.join(__dirname,'public')) );
app.use("/files", express.static(path.resolve (__dirname, "..", "images")));

app.post("/upload", upload.single("image"),(req,res)=>{
    const { filename } = req.file;
    deleteImage(filename);

    return res.json({ filename });
})

server.listen(process.env.PORT || 3000);