const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const port = 8000;
const moment = require('moment');

require("./routes")(app);

//game namespace: oneRoom

//room: 1 2 3

const gameSocket = io.of('/oneRoom')

let players = []

gameSocket.on('connection', function(socket){

    console.log('id: ' + socket.id)
    players.push({
        "_id" : socket.id,
        "player": '',
        "socket_room": `${socket.id}`
    })
    const index = players.length-1

    const updatePlayerList = () => {
        let updatedPlayers = players.map(x => {
            return {name: x.player, socketID: x._id}
        }).filter(x => x.name != '')
        console.log(updatedPlayers)
        gameSocket.emit('playerJoined', updatedPlayers) 
    }
    console.log(`player ${players.length} has connected`);
    socket.join(players[index].socket_room);
    console.log('socket joined ' + players[index].socket_room)
    socket.on('setName', (name) => {
        players[index].player = name
        console.log(players[index])
        updatePlayerList()
        socket.in(players[index].socket_room).emit("joinSuccess", players[index]._id)
    })
    setInterval(() => {
        socket.in(players[index].socket_room).emit("time", `player${players[index].player}-${moment().format()}`)
        // console.log('emit')
    }, 1000);
    socket.on('disconnect', () => {
        console.log('disconnected: ' + socket.id);
        players.map((x,index) => {
            if(x._id == socket.id) {
                players[index].player =''
            }
        })
        updatePlayerList()
    })
});

// app.listen(port, () => console.log(`Coup server listening on port ${port}!`));

server.listen(port, function(){
    console.log('listening on 8000');
});