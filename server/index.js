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
    openSocket(newSocket, `/${newNamespace}`);
    namespaces.push(newNamespace);
    console.log(newNamespace + " CREATED")
    res.json({namespace: newNamespace});
})

app.get('/exists/:namespace', function (req, res) { //returns bool
    const namespace = req.params.namespace;
    res.json({exists: namespaces.includes(namespace)});
})

//game namespace: oneRoom

openSocket = (gameSocket, namespace) => {

    let players = []; //includes deleted for index purposes
    let partyMembers = []; //actual members
    let partyLeader = ''
    gameSocket.on('connection', (socket) => {
        console.log('id: ' + socket.id);
        players.push({
            "player": '',
            "socket_id": `${socket.id}`,
            "isReady": false
        })
        console.log(`player ${players.length} has connected`);
        socket.join(socket.id);
        console.log('socket joined ' + socket.id);
        const index = players.length-1;

        const updatePartyList = () => {
            partyMembers = players.map(x => {
                return {name: x.player, socketID: x.socket_id, isReady: x.isReady}
            }).filter(x => x.name != '')
            console.log(partyMembers);
            gameSocket.emit('partyUpdate', partyMembers) ;
        }

        socket.on('setName', (name) => { //when client joins, it will immediately set its name
            if(!players.map(x => x.player).includes(name)){
                if(partyMembers.length >= 7) {
                    gameSocket.to(players[index].socket_id).emit("joinFailed", 'party_full');
                } else {
                    if(partyMembers.length == 0) {
                        partyLeader = players[index].socket_id;
                        players[index].isReady = true;
                        gameSocket.to(players[index].socket_id).emit("leader");
                        console.log("PARTY LEADER IS: " + partyLeader);
                    }
                    players[index].player = name;
                    console.log(players[index]);
                    updatePartyList();
                    gameSocket.to(players[index].socket_id).emit("joinSuccess", players[index].socket_id);
                }
                
            } else {
                gameSocket.to(players[index].socket_id).emit("joinFailed", 'name_taken');
            }  
        })
        socket.on('setReady', (isReady) => { //when client is ready, they will update this
            console.log(`${players[index].player} is ready`);
            players[index].isReady = isReady;
            updatePartyList();
            gameSocket.to(players[index].socket_id).emit("readyConfirm");
        })
    
        socket.on('disconnect', () => {
            console.log('disconnected: ' + socket.id);
            players.map((x,index) => {
                if(x.socket_id == socket.id) {
                    players[index].player ='';
                    if(socket.id === partyLeader) {
                        console.log('Leader has disconnected');
                        gameSocket.emit('leaderDisconnect', 'leader_disconnected');
                        socket.removeAllListeners();
                        delete io.nsps[namespace];
                        players = [];
                        partyMembers = []
                    }
                }
            })
            updatePartyList();
        })
    });
}

server.listen(port, function(){
    console.log('listening on 8000');
});