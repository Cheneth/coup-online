const gameUtils = require('./utils')

class CoupGame{

    constructor(players, gameSocket) {
        this.nameSocketMap = gameUtils.buildNameSocketMap(players);
        this.players = gameUtils.buildPlayers(players);
        this.gameSocket = gameSocket;
        this.currentPlayer = 0;
        this.deck = gameUtils.buildDeck();
        this.winner = '';
        this.actions = {
            income: {
                influence: "all",
                blockableBy: [],
                isChallengeable: false,
                moneyDelta: 1
            },
            foreign_aid: {
                influence: "all",
                blockableBy: ["duke"],
                isChallengeable: false,
                moneyDelta: 2
            },
            coup: {
                influence: "all",
                blockableBy: [],
                isChallengeable: false,
                moneyDelta: -7
            },
            tax: {
                influence: "duke",
                blockableBy: [],
                isChallengeable: true,
                moneyDelta: 3
            },
            assassinate: {
                influence: "assassin",
                blockableBy: ["contessa"],
                isChallengeable: true,
                moneyDelta: -3
            },
            exchange: {
                influence: "ambassador",
                blockableBy: [],
                isChallengeable: true,
                moneyDelta: 0
            },
            steal: {
                influence: "captain",
                blockableBy: ["ambassador", "captain"],
                isChallengeable: true,
                moneyDelta: 2 // EDGE CASE: if victim only has 1 or 0 coins
            },
        };
        this.counterActions = { // all challengeable
            block_foreign_aid: {
                influences: ["duke"]
            },
            block_steal: {
                influences: ["duke", "captain"]
            },
            block_assassinate: {
                influences: ["contessa"]
            },
        }
        this.isChallengeBlockOpen = false;
        this.votes = 0;
        this.aliveCount = 0;
    }

    resetGame(startingPlayer = 0) {
        this.currentPlayer = startingPlayer;
        this.isChallengeBlockOpen = false;
        this.aliveCount = this.players.length;
        this.votes = 0;
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
            socket.on('g-actionDecision', (res) => {
                // res.action.target, res.action.action res.name, res.target
                if(this.actions[res.action.action].isChallengeable) {
                    openChallenge(res.action, res.name, (this.actions[res.action].blockableBy.length > 0))
                } else if(res.action.action == 'foreign_aid') {
                    this.isChallengeBlockOpen = true;
                    this.gameSocket.emit("g-openBlock");
                } else {
                    applyAction(res.action)
                }
            })
            socket.on('g-challengeDecision', (res) => {
                // res.action.action, res.action.target, res.challengee, res.challenger, res.isChallenging
                if(this.isChallengeBlockOpen) {
                    if(res.isChallenging) {
                        closeChallenge();
                        //TODO reveal
                    } else if(votes+1 == this.aliveCount-1) {
                        //then it is a pass
                        closeChallenge();
                        applyAction(res.action, res.challengee)
                    } else {
                        this.votes += 1;
                    }
                }
            });
            socket.on('g-challengeBlockDecision', (res) => {
                // res.counterAction, res.prevAction, res.challengee, res.challenger, res.isChallenging
                if(this.isChallengeBlockOpen) {
                    if(res.isChallenging) {
                        closeChallenge();
                        //TODO reveal
                    } else if(votes+1 == this.aliveCount-1) {
                        //then it is a pass
                        closeChallenge();
                        nextTurn();
                    } else {
                        this.votes += 1;
                    }
                }
            });
            socket.on('g-blockDecision', (res) => {
                // res.prevAction.action, res.prevAction.target, res.counterAction, res.blockee, res.blocker, res.isBlocking
                if(this.isChallengeBlockOpen) {
                    if(res.isBlocking) {
                        closeChallenge();
                        openBlockChallenge(res.counterAction, res.blockee, res.prevAction);
                    } else if(votes+1 == this.aliveCount-1) {
                        //then it is a pass
                        closeChallenge();
                        applyAction(res.action, res.blockee);
                    } else {
                        this.votes += 1;
                    }
                }
            });
        })
    }

    closeChallenge() {
        this.isChallengeBlockOpen = false;
        this.votes = 0;
        this.gameSocket.emit("g-closeChallenge");
        this.gameSocket.emit("g-closeBlock");
    }

    openChallenge(action, name, target, isBlockable) {
        this.isChallengeBlockOpen = true;
        if(isBlockable) {
            let targetIndex = 0;
            for(let i = 0; i < this.players.length; i++) {
                if(players[i].name == target) {
                    targetIndex = i;
                    break;
                }
            }
            this.gameSocket.to(this.players[targetIndex].socketID).emit("g-openBlock");
        }
        this.gameSocket.emit("g-openChallenge", {
            action: action,
            name: name
        });
    }

    openBlockChallenge(counterAction, blockee, prevAction) {
        //blockClaim is the character that the blockee claims to be blocking with
        this.isChallengeBlockOpen = true;
        this.gameSocket.emit("g-openChallengeBlock", {
            counterAction: counterAction,
            name: blockee,
            prevAction: prevAction
        });

    }

    applyAction(action) {

    }

    nextTurn() {
        do {
            this.currentPlayer+=1;
            this.currentPlayer%=this.players.length;
        } while(this.players[this.currentPlayer].isDead == true);
        playTurn();
    }

    playTurn() {
        this.gameSocket.emit("g-updateCurrentPlayer", this.currentPlayer);
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