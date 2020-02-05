const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const port = 8000;
const moment = require('moment')

app.get('/', (req, res) => res.send('Hello World!'));

//game namespace: oneRoom

//room: 1 2 3

const gameSocket = io.of('/oneRoom')

let players = []

gameSocket.on('connection', function(socket){
    console.log('id: ' + socket.id)
    players.push({
        "_id" : socket.id,
        "player": players.length,
        "socket_room": `room${players.length}`
    })
    console.log(`player ${players.length} has connected`);
    socket.join(players[players.length-1].socket_room);
    console.log('socket joined ' + players[players.length-1].socket_room)
    setInterval(() => {
        socket.in(players[players.length-1].socket_room).emit("time", `player${players[players.length-1].player}-${moment().format()}`)
        // console.log('emit')
    }, 1000);
    socket.on('disconnect', (clientID) => console.log('closed: ' + socket.id))
});

// app.listen(port, () => console.log(`Coup server listening on port ${port}!`));

server.listen(port, function(){
    console.log('listening on 8000');
});