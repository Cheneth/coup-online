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
        deck.push("countessa");
    }
    for(let i = 0; i < deck.length; i++) {
        const one = Math.floor(Math.random()*(deck.length-1));
        const two = Math.floor(Math.random()*(deck.length-1));
        let temp = deck[one];
        deck[one] = deck[two];
        deck[two] = temp;
    }
    console.log(deck)
    return deck
}

buildPlayers = (players) => {
    players.forEach(x => {
        x.money = 0;
        x.influences = [];
    });
    console.log(players);
    return players;
}

module.exports = {
    buildDeck: buildDeck,
    buildPlayers: buildPlayers
}