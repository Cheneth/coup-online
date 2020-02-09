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
        this.isRevealOpen = false;
        this.isChooseInfluenceOpen = false;
        this.votes = 0;
        this.aliveCount = 0;
    }

    resetGame(startingPlayer = 0) {
        this.currentPlayer = startingPlayer;
        this.isChallengeBlockOpen = false;
        this.isRevealOpen = false;
        this.isChooseInfluenceOpen = false;
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
                        applyAction(res.action, res.blockee);
                    } else {
                        this.votes += 1;
                    }
                }
            });
            socket.on('g-revealDecision', (res) => {
                // res.revealedCard, prevaction, counterAction, challengee, challenger, isBlock
                if(this.isRevealOpen) {
                    if(res.isBlock) { //block challenge
                        if(res.revealedCard == res.counterAction.claim) { //challenge failed
                            this.isChooseInfluenceOpen = true;
                            this.gameSocket.to(this.nameSocketMap[res.challenger]).emit('g-chooseInfluence');
                            nextTurn();
                        } else { //challenge succeeded
                            for(let i = 0; i < this.players[res.challengee].influences.length; i++) {
                                if(this.players[res.challengee].influences[i] == res.revealedCard) {
                                    this.deck.push(this.players[res.challengee].influences[i]);
                                    this.deck = gameUtils.shuffleDeck(deck);
                                    this.players[res.challengee].influences.splice(i,1);
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
                            for(let i = 0; i < this.players[res.challengee].influences.length; i++) {
                                if(this.players[res.challengee].influences[i] == res.revealedCard) {
                                    this.deck.push(this.players[res.challengee].influences[i]);
                                    this.deck = gameUtils.shuffleDeck(deck);
                                    this.players[res.challengee].influences.splice(i,1);
                                    break;
                                }
                            }
                            updateInfluences();
                            this.isRevealOpen = false;
                            nextTurn();
                        }
                    }
                }
            });
            socket.on('g-chooseInfluenceDecision', (res) => {
                // res.influence, res.playerName
                if(this.isChooseInfluenceOpen) {
                    for(let i = 0; i < this.players[res.playerName].influences.length; i++) {
                        if(this.players[res.playerName].influences[i] == res.influence) {
                            this.deck.push(this.players[res.playerName].influences[i]);
                            this.deck = gameUtils.shuffleDeck(deck);
                            this.players[challengee].influences.splice(i,1);
                            break;
                        }
                    }
                    updateInfluences();
                    this.isChooseInfluenceOpen = false;
                    nextTurn();
                }
            })
        })
    }

    updateInfluences() {

    }

    updateMoney() {

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

    applyAction(action, actioner) {

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