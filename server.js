'use strict';
/* 
   Updates will be posted very soon
   Continue following this repo 
*/

const express = require('express');
var app = express();
const http = require('http');
var path = require('path'); 
var server = http.createServer(app);
const socketio = require('socket.io');
var io = new socketio.Server(server);

app.use('/public', express.static(path.join((__dirname + '/public'))));

io.sockets.on('connection', (socket) => {
    console.log('New client: ' + socket.id);
    socket.on('join', async (uname, room) => {
        socket.nickname = uname;
        socket.join(room);
        io.sockets.in(room).emit("message", "Admin", `${uname} has joined at room ${room}`);

        let roomUsers = await io.sockets.in(room).fetchSockets();
        console.log(roomUsers);
    });
    socket.on("newMessage", (messageText, room, uname) => {
        io.sockets.in(room).emit("message", uname, messageText);
    })
});


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

server.listen(3000, () => console.log("Server is listening on port 3000!"));
