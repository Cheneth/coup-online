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
                influences: ["ambassador", "captain"]
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
        // console.log(this.deck, this.players);
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
            let bind = this
            socket.on('g-deductCoins', (res) => {
                //res.amount res.source
                console.log('deducting ' + res.amount + ' coins from ' + res.source )
                const sourceIndex = bind.nameIndexMap[res.source];
                bind.players[sourceIndex].money -= res.amount;
                bind.updatePlayers();

            })
            socket.on('g-actionDecision', (res) => {
                console.log(108, res)
                // res.action.target, res.action.action, res.action.source
                // console.log(bind.actions, res.action.action)
                if(bind.actions[res.action.action].isChallengeable) {
                    bind.openChallenge(res.action, (bind.actions[res.action.action].blockableBy.length > 0))
                } else if(res.action.action == 'foreign_aid') {
                    bind.isChallengeBlockOpen = true;
                    bind.gameSocket.emit("g-openBlock", res.action);
                } else {
                    bind.applyAction(res.action)
                }
            })
            socket.on('g-challengeDecision', (res) => {
                console.log(120, res)
                // res.action.action, res.action.target, res.action.source, res.challengee, res.challenger, res.isChallenging
                if(bind.isChallengeBlockOpen) {
                    if(res.isChallenging) {
                        bind.closeChallenge();
                        //TODO reveal
                        // reveal(action, counterAction, challengee, challenger, isBlock)
                        bind.reveal(res.action, null, res.challengee, res.challenger, false);
                    } else if(bind.votes+1 == bind.aliveCount-1) {
                        //then it is a pass
                        bind.closeChallenge();
                        bind.applyAction(res.action);
                    } else {
                        bind.votes += 1;
                    }
                }
            });
            socket.on('g-blockChallengeDecision', (res) => {
                console.log(137, res)
                // res.counterAction, res.prevAction, res.challengee, res.challenger, res.isChallenging
                if(bind.isChallengeBlockOpen) {
                    if(res.isChallenging) {
                        bind.closeChallenge();
                        //TODO reveal
                        bind.reveal(res.prevAction, res.counterAction, res.challengee, res.challenger, true);
                    } else if(bind.votes+1 == bind.aliveCount-1) {
                        //then it is a pass
                        bind.closeChallenge();
                        bind.nextTurn();
                    } else {
                        bind.votes += 1;
                    }
                }
            });
            socket.on('g-blockDecision', (res) => {
                console.log(154, res)
                // res.prevAction.action, res.prevAction.target, res.prevAction.source, res.counterAction, res.blockee, res.blocker, res.isBlocking
                if(bind.isChallengeBlockOpen) {
                    if(res.isBlocking) {
                        bind.closeChallenge();
                        bind.openBlockChallenge(res.counterAction, res.blockee, res.prevAction);
                    } else if(bind.votes+1 == bind.aliveCount-1) {
                        //then it is a pass
                        bind.closeChallenge();
                        bind.applyAction(res.action);
                    } else {
                        bind.votes += 1;
                    }
                }
            });
            socket.on('g-revealDecision', (res) => {
                console.log(171, res)
                console.log(res.isBlock)
                //if isBlock, prevaction should contain the prev action
                //if isBlock is false, prevaction is action
                // res.revealedCard, prevaction, counterAction, challengee, challenger, isBlock
                const challengeeIndex = bind.nameIndexMap[res.challengee];
                if(bind.isRevealOpen) {
                    if(res.isBlock) { //block challenge
                        if(res.revealedCard == res.counterAction.claim || (res.counterAction.counterAction == 'block_steal' && (res.revealedCard == 'ambassador' || res.revealedCard =='captain'))) { //challenge failed
                            for(let i = 0; i < bind.players[challengeeIndex].influences.length; i++) { //revealed card needs to be replaced
                                if(bind.players[challengeeIndex].influences[i] == res.revealedCard) {
                                    bind.deck.push(bind.players[challengeeIndex].influences[i]);
                                    bind.deck = gameUtils.shuffleDeck(bind.deck);
                                    bind.players[challengeeIndex].influences.splice(i,1);
                                    bind.players[challengeeIndex].influences.push(bind.deck.pop());
                                    break;
                                }
                            }
                            bind.updatePlayers();
                            bind.isChooseInfluenceOpen = true;
                            bind.gameSocket.to(bind.nameSocketMap[res.challenger]).emit('g-chooseInfluence');
                            // bind.nextTurn();
                        } else { //challenge succeeded
                            for(let i = 0; i < bind.players[challengeeIndex].influences.length; i++) {
                                if(bind.players[challengeeIndex].influences[i] == res.revealedCard) {
                                    bind.deck.push(bind.players[challengeeIndex].influences[i]);
                                    bind.deck = gameUtils.shuffleDeck(bind.deck);
                                    bind.players[challengeeIndex].influences.splice(i,1);
                                    break;
                                }
                            }
                            console.log(res.prevAction)
                            bind.applyAction(res.prevAction);
                        }
                    } else { //normal challenge
                        if(res.revealedCard == bind.actions[res.prevAction.action].influence) { // challenge failed
                            bind.isChooseInfluenceOpen = true;
                            bind.gameSocket.to(bind.nameSocketMap[res.challenger]).emit('g-chooseInfluence');
                            bind.applyAction(res.prevAction);
                        } else { // challenge succeeded
                            for(let i = 0; i < bind.players[challengeeIndex].influences.length; i++) { // 
                                if(bind.players[challengeeIndex].influences[i] == res.revealedCard) {
                                    bind.deck.push(bind.players[challengeeIndex].influences[i]);
                                    bind.deck = gameUtils.shuffleDeck(bind.deck);
                                    bind.players[challengeeIndex].influences.splice(i,1);
                                    break;
                                }
                            }
                            bind.isRevealOpen = false;
                            bind.nextTurn();
                        }
                    }
                }
            });
            socket.on('g-chooseInfluenceDecision', (res) => {
                console.log(211, res)
                // res.influence, res.playerName
                const playerIndex = bind.nameIndexMap[res.playerName];
                if(bind.isChooseInfluenceOpen) {
                    for(let i = 0; i < bind.players[playerIndex].influences.length; i++) {
                        if(bind.players[playerIndex].influences[i] == res.influence) {
                            bind.deck.push(bind.players[playerIndex].influences[i]);
                            bind.deck = gameUtils.shuffleDeck(bind.deck);
                            bind.players[playerIndex].influences.splice(i,1);
                            break;
                        }
                    }
                    bind.isChooseInfluenceOpen = false;
                    bind.nextTurn();
                }
            })
            socket.on('g-chooseExchangeDecision', (res) => {
                console.log(228, res)
                // res.playerName, res.kept, res.putBack = ["influence","influence"]
                const playerIndex = bind.nameIndexMap[res.playerName];
                if(bind.isExchangeOpen) {
                    bind.players[playerIndex].influences = res.kept;
                    bind.deck.push(res.putBack[0]);
                    bind.deck.push(res.putBack[1]);
                    bind.deck = gameUtils.shuffleDeck(bind.deck);
                    bind.isExchangeOpen = false;
                    bind.nextTurn();
                }
            })
        })
    }

    updatePlayers() {// when players die
        this.gameSocket.emit('g-updatePlayers', gameUtils.exportPlayers(JSON.parse(JSON.stringify(this.players))));
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
        console.log(258, res)
        console.log(this.nameSocketMap)
        console.log(challengee)
        this.isRevealOpen = true;
        this.gameSocket.to(this.nameSocketMap[res.challengee]).emit("g-chooseReveal", res);
    }

    closeChallenge() {
        this.isChallengeBlockOpen = false;
        this.votes = 0;
        this.gameSocket.emit("g-closeChallenge");
        this.gameSocket.emit("g-closeBlock");
        this.gameSocket.emit("g-closeBlockChallenge");
    }

    openChallenge(action, isBlockable) {
        console.log(264, action)
        this.isChallengeBlockOpen = true;
        if(isBlockable && action.target != null) {
            let targetIndex = 0;
            for(let i = 0; i < this.players.length; i++) {
                if(this.players[i].name == action.target) {
                    targetIndex = i;
                    break;
                }
            }
            console.log(this.players[targetIndex].socketID)
            this.gameSocket.to(this.players[targetIndex].socketID).emit("g-openBlock", action);
        }
        this.gameSocket.emit("g-openChallenge", action);
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
        console.log(this.players)
        console.log(action)
        const execute = action.action;
        const target = action.target;
        const source = action.source;
        if(execute == 'income') {
            for(let i = 0; i < this.players.length; i++) {
                if(this.players[i].name == source) {
                    this.players[i].money+=1;
                    break;
                }
            }
            this.nextTurn();
        }else if(execute == 'foreign_aid') {
            for(let i = 0; i < this.players.length; i++) {
                if(this.players[i].name == source) {
                    this.players[i].money+=2;
                    break;
                }
            }
            this.nextTurn();
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
            this.nextTurn();
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
                console.log(348, this.players[i].name, target)
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
            this.nextTurn();
        }else {
            console.log('ERROR ACTION NOT FOUND');
        }
        
    }

    nextTurn() {
        this.players.forEach(x => {
            console.log(x.influences)
            if(x.influences.length == 0 && !x.isDead) {// player is dead
                this.aliveCount-=1;
                x.isDead = true;
                x.money = 0;
            }
        });
        if(this.aliveCount == 1) {
            let winner = null
            for(let i = 0; i < this.players.length; i++) {
                if(this.players[i].influences.length > 0) {
                    winner = this.players[i].name; 
                }
            }
            this.gameSocket.emit('g-gameOver', winner);
            //GAME END
        } else {
            this.updatePlayers();
            do {
                this.currentPlayer+=1;
                this.currentPlayer%=this.players.length;
            } while(this.players[this.currentPlayer].isDead == true);
            this.playTurn();
        }
        
    }

    playTurn() {
        this.gameSocket.emit("g-updateCurrentPlayer", this.players[this.currentPlayer].name);
        console.log(this.players[this.currentPlayer].socketID)
        this.gameSocket.to(this.players[this.currentPlayer].socketID).emit('g-chooseAction');
    }

    onChooseAction(action) {
        console.log('action', action)
    }

    start() {
        this.resetGame();
        this.listen();
        this.updatePlayers();
        console.log('Game has started');
        this.playTurn()
        
        //deal cards to each player
    }
    
}

module.exports = CoupGame;