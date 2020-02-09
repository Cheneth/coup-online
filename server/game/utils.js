buildDeck = () => {
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
        deck.push("contessa");
    }
    for(let i = 0; i < deck.length*2; i++) {
        const one = Math.floor(Math.random()*(deck.length-1));
        const two = Math.floor(Math.random()*(deck.length-1));
        let temp = deck[one];
        deck[one] = deck[two];
        deck[two] = temp;
    }
    console.log(deck);
    return deck;
}

shuffleDeck = (deck) => {
    for(let i = 0; i < deck.length*2; i++) {
        const one = Math.floor(Math.random()*(deck.length-1));
        const two = Math.floor(Math.random()*(deck.length-1));
        let temp = deck[one];
        deck[one] = deck[two];
        deck[two] = temp;
    }
    return deck;
}

buildNameSocketMap = (players) => {
    return players.map((x) => {
        let keyVal = {};
        keyVal[x.name] = x.socketID;
        return keyVal;
    })
}

buildPlayers = (players) => {
    players.forEach(x => {
        x.money = 2;
        x.influences = [];
        x.isDead = false;
        delete x.isReady;
    });
    console.log(players);
    return players;
}

module.exports = {
    buildDeck: buildDeck,
    buildPlayers: buildPlayers,
    shuffleDeck: shuffleDeck,
    buildNameSocketMap: buildNameSocketMap
}