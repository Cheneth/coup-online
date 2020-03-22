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
        const one = i%deck.length
        const two = Math.floor(Math.random()*(deck.length-1));
        let temp = deck[one];
        deck[one] = deck[two];
        deck[two] = temp;
    }
    return deck;
}

buildNameSocketMap = (players) => {
    let map = {}
    players.map((x) => {
        map[x.name] = x.socketID;
    })
    return map
}

buildNameIndexMap = (players) => {
    let map = {}
    players.map((x, index) => {
        map[x.name] = index;
    })
    return map
}

buildPlayers = (players) => {
    colors = ['#73C373', '#7AB8D3', '#DD6C75', '#8C6CE6', '#EA9158', '#CB8F8F', '#FFC303']
    for(let i = 0; i < colors.length*2; i++) {
        const one = i%colors.length
        const two = Math.floor(Math.random()*(colors.length-1));
        let temp = colors[one];
        colors[one] = colors[two];
        colors[two] = temp;
    }
    players.forEach(x => {
        delete x.chosen;
        x.money = 2;
        x.influences = [];
        x.isDead = false;
        x.color = colors.pop();
        delete x.isReady;
    });
    console.log(players);
    return players;
}

exportPlayers = (players) => {
    players.forEach(x => {
        delete x.socketID;
    });
    return players;
}

module.exports = {
    buildDeck: buildDeck,
    buildPlayers: buildPlayers,
    exportPlayers: exportPlayers,
    shuffleDeck: shuffleDeck,
    buildNameSocketMap: buildNameSocketMap,
    buildNameIndexMap: buildNameIndexMap
}