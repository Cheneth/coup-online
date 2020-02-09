const gameUtils = require('./utils')

class CoupGame{

    constructor(players, gameSocket) {
        this.nameSocketMap = gameUtils.buildNameSocketMap(players);
        this.players = gameUtils.buildPlayers(players);
        this.gameSocket = gameSocket;
        this.currentPlayer = 0;
        this.deck = gameUtils.buildDeck();
        this.winner = '';
    }

    resetGame(startingPlayer = 0) {
        this.currentPlayer = startingPlayer;
        for(let i = 0; i < this.players.length; i++) {
            this.players[i].money = 2;
            this.players[i].influences = [this.deck.pop(), this.deck.pop()];
            this.players[i].isDead = false;
        }
        console.log(this.deck, this.players);
    }

    listen() {
        this.players.map(x => {
            const socket = this.gameSocket.sockets[x.socketID];
            socket.on('g-actionDecision', (action) => {
                console.log('player: ', action.name)
                console.log('action: ', action.action)
            })
        })
    }



    playTurn() {
        this.gameSocket.to(this.players[this.currentPlayer].socketID).emit("g-chooseAction");
    }

    onChooseAction(action) {
        console.log('action', action)
    }

    start() {
        this.resetGame();
        this.listen();
        this.playTurn()
        
        console.log('Game has started');
        //deal cards to each player
    }
    
}

module.exports = CoupGame;