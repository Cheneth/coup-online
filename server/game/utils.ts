import {CardNames} from "../utilities/constants";

export function buildDeck() {
    let deck: string[] = [];
    let cardNames = Object.values(CardNames);
    for (let card of cardNames) {
        addToDeck(card, deck);
    }
    for(let i = 0; i < deck.length*2; i++) {
        const one = Math.floor(Math.random()*(deck.length-1));
        const two = Math.floor(Math.random()*(deck.length-1));
        let temp = deck[one];
        deck[one] = deck[two];
        deck[two] = temp;
    }
    return deck;
}

export function addToDeck(cardName: string, deck: string[]) {
    if (!cardName || !deck) {
        console.log("cardName and deck must not be undefined.");
        return;
    }
    for (let i = 0; i < 3; i++) {
        deck.push(cardName);
    }
}

export function shuffleArray(arr: Object[]) {
    if (!arr) {
        console.log(`arr must not be undefined. arr was ${arr}`);
    }

    for(let i = 0; i < arr.length*2; i++) {
        const one = i%arr.length
        const two = Math.floor(Math.random()*(arr.length-1));
        let temp = arr[one];
        arr[one] = arr[two];
        arr[two] = temp;
    }
    return arr;
}

export function buildNameSocketMap(players: Player[]): {[key: string]: string} {
    let map: {[key: string]: string} = {};
    players.map((x) => {
        map[x.name] = x.socketID;
    });
    return map;
}

export function buildNameIndexMap(players: Player[]): {[key: string]: number} {
    let map: {[key: string]: number} = {};
    players.map((x, index) => {
        map[x.name] = index;
    });
    return map;
}

export type Player = {
    name: string;
    socketID: string;
    color: string;
    money: number;
    influences: string[];
    isDead: boolean;
    isReady: boolean;
    chosen: boolean;
}

export function buildPlayers(players: Player[]) {
    let colors: string[] = ['#73C373', '#7AB8D3', '#DD6C75', '#8C6CE6', '#EA9158', '#CB8F8F', '#FFC303'];
    shuffleArray(colors);

    players.forEach((x, index) => {
        x.money = 2;
        x.influences = [];
        x.isDead = false;
        x.color = colors[index];
    });
    console.log(players);
    return players;
}

export function exportPlayers(players: Player[]) {
    players.forEach(x => {
        x.socketID = '';
    });
    return players;
}