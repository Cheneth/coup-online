const express = require('express');
const moment = require('moment');

// Server/express setup
const app = express();
const cors = require('cors');
app.use(cors());
const server = require('http').createServer(app);
const io = require('socket.io')(server);


// require("./routes")(app);
const generateNamespace = require('./utilities/utilities.js')

// Constants
const port = 8000;

let namespaces = []; //AKA party rooms

app.get('/createNamespace', function (req, res) { 
    let newNamespace = '';
    while(newNamespace === '' || namespaces.includes(newNamespace)) {
        newNamespace = generateNamespace(); //default length 6
    }

    const newSocket = io.of(`/${newNamespace}`);
    openSocket(newSocket);
    namespaces.push(newNamespace);
    res.json({namespace: newNamespace});
})

app.get('/exists/:namespace', function (req, res) { //returns bool
    const namespace = req.params.namespace;
    res.json({exists: namespaces.includes(namespace)});
})

//game namespace: oneRoom

openSocket = (gameSocket) => {

    let players = []; //includes deleted for index purposes
    let partyMembers = []; //actual members
    gameSocket.on('connection', (socket) => {
        console.log('id: ' + socket.id);
        players.push({
            "_id" : socket.id,
            "player": '',
            "socket_room": `${socket.id}`,
            "isReady": false
        })
        console.log(`player ${players.length} has connected`);
        socket.join(socket.id);
        console.log('socket joined ' + socket.id);
        const index = players.length-1;

        const updatePartyList = () => {
            partyMembers = players.map(x => {
                return {name: x.player, socketID: x._id, isReady: x.isReady}
            }).filter(x => x.name != '')
            console.log(partyMembers);
            gameSocket.emit('partyUpdate', partyMembers) ;
        }

        socket.on('setName', (name) => { //when client joins, it will immediately set its name
            if(!players.map(x => x.player).includes(name)){
                if(partyMembers.length >= 7) {
                    gameSocket.to(players[index].socket_room).emit("joinFailed", 'party_full');
                } else {
                    players[index].player = name;
                    console.log(players[index]);
                    updatePartyList();
                    gameSocket.to(players[index].socket_room).emit("joinSuccess", players[index]._id);
                }
                
            } else {
                gameSocket.to(players[index].socket_room).emit("joinFailed", 'name_taken');
            }  
        })
        socket.on('setReady', (isReady) => { //when client is ready, they will update this
            console.log(`${players[index].player} is ready`);
            players[index].isReady = isReady;
        })
    
        socket.on('disconnect', () => {
            console.log('disconnected: ' + socket.id);
            players.map((x,index) => {
                if(x._id == socket.id) {
                    players[index].player ='';
                }
            })
            updatePartyList();
        })
    });
}

server.listen(port, function(){
    console.log('listening on 8000');
});