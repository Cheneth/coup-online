const gameUtils = require('./utils')

class CoupGame{

    constructor(players, socket, gameSocket) {
        this.players = gameUtils.buildPlayers(players);
        this.socket = socket; //in
        this.gameSocket = gameSocket; //out
        this.currentPlayer = 0;
        this.deck = gameUtils.buildDeck();
    }

    buildDeck() {
        let deck = []
        for(let i = 0; i < 3; i++) {
            deck.push("duke");
        }
        for(let i = 0; i < 3; i++) {
            deck.push("assassin");
        }
        for(let i = 0; i < 3; i++) {
            deck.push("captain");
        }
        for(let i = 0; i < 3; i++) {
            deck.push("ambassador");
        }
        for(let i = 0; i < 3; i++) {
            deck.push("countessa");
        }
        for(let i = 0; i < deck.length; i++) {
            const one = Math.floor(Math.random()*(deck.length-1));
            const two = Math.floor(Math.random()*(deck.length-1));
            let temp = deck[one];
            deck[one] = deck[two];
            deck[two] = temp;
        }
        return deck;
    }

    start() {
        console.log('Game has started');
    }
    
}

module.exports = CoupGame;