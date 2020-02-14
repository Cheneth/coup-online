const gameUtils = require('./utils')

class CoupGame{

    constructor(players, gameSocket) {
        this.nameSocketMap = gameUtils.buildNameSocketMap(players);
        this.nameIndexMap = gameUtils.buildNameIndexMap(players);
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
        this.isChallengeBlockOpen = false; // if listening for challeng or block votes
        this.isRevealOpen = false; // if listening for what influence player will reveal
        this.isChooseInfluenceOpen = false; // if listening for what influence to lose
        this.isExchangeOpen = false; // if listening for result of ambassador exchange;
        this.votes = 0;
        this.aliveCount = 0;
    }

    resetGame(startingPlayer = 0) {
        this.currentPlayer = startingPlayer;
        this.isChallengeBlockOpen = false;
        this.isRevealOpen = false;
        this.isChooseInfluenceOpen = false;
        this.isExchangeOpen = false;
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
        // action = {
        //     action: "",
        //     target: "",
        //     source: ""
        // }
        // counterAction = {
        //     counterAction: "",
        //     target: "",
        //     source: ""
        // }

        this.players.map(x => {
            const socket = this.gameSocket.sockets[x.socketID];
            socket.on('g-actionDecision', (res) => {
                // res.action.target, res.action.action, res.action.source
                if(this.actions[res.action.action].isChallengeable) {
                    openChallenge(res.action, (this.actions[res.action].blockableBy.length > 0))
                } else if(res.action.action == 'foreign_aid') {
                    this.isChallengeBlockOpen = true;
                    this.gameSocket.emit("g-openBlock");
                } else {
                    applyAction(res.action)
                }
            })
            socket.on('g-challengeDecision', (res) => {
                // res.action.action, res.action.target, res.action.source, res.challengee, res.challenger, res.isChallenging
                if(this.isChallengeBlockOpen) {
                    if(res.isChallenging) {
                        closeChallenge();
                        //TODO reveal
                        reveal();
                    } else if(votes+1 == this.aliveCount-1) {
                        //then it is a pass
                        closeChallenge();
                        applyAction(res.action);
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
                        reveal();
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
                // res.prevAction.action, res.prevAction.target, res.prevAction.source, res.counterAction, res.blockee, res.blocker, res.isBlocking
                if(this.isChallengeBlockOpen) {
                    if(res.isBlocking) {
                        closeChallenge();
                        openBlockChallenge(res.counterAction, res.blockee, res.prevAction);
                    } else if(votes+1 == this.aliveCount-1) {
                        //then it is a pass
                        closeChallenge();
                        applyAction(res.action);
                    } else {
                        this.votes += 1;
                    }
                }
            });
            socket.on('g-revealDecision', (res) => {
                // res.revealedCard, prevaction, counterAction, challengee, challenger, isBlock
                const challengeeIndex = this.nameIndexMap[res.challengee];
                if(this.isRevealOpen) {
                    if(res.isBlock) { //block challenge
                        if(res.revealedCard == res.counterAction.claim) { //challenge failed
                            this.isChooseInfluenceOpen = true;
                            this.gameSocket.to(this.nameSocketMap[res.challenger]).emit('g-chooseInfluence');
                            nextTurn();
                        } else { //challenge succeeded
                            for(let i = 0; i < this.players[challengeeIndex].influences.length; i++) {
                                if(this.players[challengeeIndex].influences[i] == res.revealedCard) {
                                    this.deck.push(this.players[challengeeIndex].influences[i]);
                                    this.deck = gameUtils.shuffleDeck(deck);
                                    this.players[challengeeIndex].influences.splice(i,1);
                                    break;
                                }
                            }
                            applyAction(res.action);
                        }
                    } else { //normal challenge
                        if(res.revealedCard == this.actions[res.action].influence) { // challenge failed
                            this.isChooseInfluenceOpen = true;
                            this.gameSocket.to(this.nameSocketMap[res.challenger]).emit('g-chooseInfluence');
                            applyAction(res.action);
                        } else { //challenge succeeded
                            for(let i = 0; i < this.players[challengeeIndex].influences.length; i++) {
                                if(this.players[challengeeIndex].influences[i] == res.revealedCard) {
                                    this.deck.push(this.players[challengeeIndex].influences[i]);
                                    this.deck = gameUtils.shuffleDeck(deck);
                                    this.players[challengeeIndex].influences.splice(i,1);
                                    break;
                                }
                            }
                            this.isRevealOpen = false;
                            nextTurn();
                        }
                    }
                }
            });
            socket.on('g-chooseInfluenceDecision', (res) => {
                // res.influence, res.playerName
                const playerIndex = this.nameIndexMap[res.playerName];
                if(this.isChooseInfluenceOpen) {
                    for(let i = 0; i < this.players[playerIndex].influences.length; i++) {
                        if(this.players[playerIndex].influences[i] == res.influence) {
                            this.deck.push(this.players[playerIndex].influences[i]);
                            this.deck = gameUtils.shuffleDeck(deck);
                            this.players[playerIndex].influences.splice(i,1);
                            break;
                        }
                    }
                    this.isChooseInfluenceOpen = false;
                    nextTurn();
                }
            })
            socket.on('g-chooseExchangeDecision', (res) => {
                // res.playerName, res.kept, res.putBack = ["influence","influence"]
                const playerIndex = this.nameIndexMap[res.playerName];
                if(this.isExchangeOpen) {
                    this.players[playerIndex].influences = res.kept;
                    this.deck.push(res.putBack[0]);
                    this.deck.push(res.putBack[1]);
                    this.deck = gameUtils.shuffleDeck(this.deck);
                    this.isExchangeOpen = false;
                    nextTurn();
                }
            })
        })
    }

    updatePlayers() {// when players die
        gameSocket.emit('g-updatePlayers', gameUtils.exportPlayers(this.players));
    }

    reveal(action, counterAction, challengee, challenger, isBlock) {
        //if isBlock, action should contain the prev action
        //if isBlock is false, counterAction is null and action is the action being challenged
        const res = {
            action: action,
            counterAction: counterAction,
            challengee: challengee,
            challenger: challenger,
            isBlock: isBlock
        }
        this.isRevealOpen = true;
        this.gameSocket.to(this.nameSocketMap[challengee]).emit("g-chooseReveal", res);
    }

    closeChallenge() {
        this.isChallengeBlockOpen = false;
        this.votes = 0;
        this.gameSocket.emit("g-closeChallenge");
        this.gameSocket.emit("g-closeBlock");
        this.gameSocket.emit("g-closeBlockChallenge");
    }

    openChallenge(action, isBlockable) {
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
            action: action
        });
    }

    openBlockChallenge(counterAction, blockee, prevAction) {
        //blockClaim is the character that the blockee claims to be blocking with
        this.isChallengeBlockOpen = true;
        this.gameSocket.emit("g-openBlockChallenge", {
            counterAction: counterAction,
            prevAction: prevAction
        });
    }

    applyAction(action) {
        const execute = this.actions[action.action];
        const target = action.target;
        const source = action.source;
        if(execute == 'income') {
            for(let i = 0; i < this.players.length; i++) {
                if(this.players[i].name == source) {
                    this.players[i].money+=1;
                    break;
                }
            }
            nextTurn();
        }else if(execute == 'foreign_aid') {
            for(let i = 0; i < this.players.length; i++) {
                if(this.players[i].name == source) {
                    this.players[i].money+=2;
                    break;
                }
            }
            nextTurn();
        }else if(execute == 'coup') {
            for(let i = 0; i < this.players.length; i++) {
                if(this.players[i].name == target) {
                    this.isChooseInfluenceOpen = true;
                    this.gameSocket.to(this.nameSocketMap[target]).emit('g-chooseInfluence');
                    break;
                }
            }
            // no nextTurn() because it is called in "on chooseInfleunceDecision"
        }else if(execute == 'tax') {
            for(let i = 0; i < this.players.length; i++) {
                if(this.players[i].name == source) {
                    this.players[i].money+=3;
                    break;
                }
            }
            nextTurn();
        }else if(execute == 'assassinate') {
            for(let i = 0; i < this.players.length; i++) {
                if(this.players[i].name == target) {
                    this.isChooseInfluenceOpen = true;
                    this.gameSocket.to(this.nameSocketMap[target]).emit('g-chooseInfluence');
                    break;
                }
            }
            // no nextTurn() because it is called in "on chooseInfleunceDecision"
        }else if(execute == 'exchange') {
            const drawTwo = [this.deck.pop(), this.deck.pop()]
            this.gameSocket.to(this.nameSocketMap[source]).emit('g-openExchange', drawTwo);
             // no nextTurn() because it is called in "on chooseExchangeDecision"
        }else if(execute == 'steal') {
            let stolen = 0;
            for(let i = 0; i < this.players.length; i++) {
                if(this.players[i].name == target) {
                    if(this.players[i].money >= 2) {
                        this.players[i].money-=2;
                        stolen = 2;
                    }else if(this.players[i].money == 1) {
                        this.players[i].money-=1;
                        stolen = 1;
                    }else{//no money stolen

                    }
                    break;
                }
            }
            for(let i = 0; i < this.players.length; i++) {
                if(this.players[i].name == source) {
                    this.players[i].money+= stolen;
                    break;
                }
            }
            nextTurn();
        }else {
            console.log('ERROR ACTION NOT FOUND');
        }
        
    }

    nextTurn() {
        this.players.forEach(x => {
            if(x.influences.length == 0) {// player is dead
                aliveCount-=1;
                x.isDead = true;
                x.money = 0;
            }
        });
        if(aliveCount == 1) {
            const winner
            for(let i = 0; i < players.length; i++) {
                if(players[i].influences.length > 0) {
                    winner = players[i].name; 
                }
            }
            gameSocket.emit('g-gameOver', winner);
            //GAME END
        } else {
            updatePlayers();
            do {
                this.currentPlayer+=1;
                this.currentPlayer%=this.players.length;
            } while(this.players[this.currentPlayer].isDead == true);
            playTurn();
        }
        
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