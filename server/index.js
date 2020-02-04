const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const port = 8000;
const moment = require('moment')

app.get('/', (req, res) => res.send('Hello World!'));

io.on('connection', function(socket){
    console.log('a user connected');
    socket.on('room', function(room) {
        socket.join(room);
    });
    setInterval(() => socket.in('1234').emit("time", moment().format()), 1000);
});

// app.listen(port, () => console.log(`Coup server listening on port ${port}!`));

server.listen(port, function(){
    console.log('listening on 8000');
});