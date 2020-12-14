import * as gameUtils from "./utils";
import { Socket } from "socket.io";
import {Actions, CounterActions} from "../utilities/constants";

type GameSocket = {
    sockets: string[];
} & Socket;

class CoupGame {
    private nameSocketMap: {[key: string]: string};
    private nameIndexMap: {[key: string]: number};
    private currentPlayer: number;
    private deck: string[];
    private isChallengeBlockOpen: boolean;
    private isChooseInfluenceOpen: boolean;
    private isExchangeOpen: boolean;
    private isRevealOpen: boolean;
    private votes: number;
    private players: gameUtils.Player[];
    private gameSocket: GameSocket;
    private aliveCount: number;
    private isPlayAgainOpen: boolean;

    constructor(players:gameUtils.Player[], gameSocket: GameSocket) {
        this.nameSocketMap = gameUtils.buildNameSocketMap(players);
        this.nameIndexMap = gameUtils.buildNameIndexMap(players);
        this.players = gameUtils.buildPlayers(players);
        this.gameSocket = gameSocket;
        this.currentPlayer = 0;
        this.deck = gameUtils.buildDeck();
        this.isChallengeBlockOpen = false; // if listening for challeng or block votes
        this.isRevealOpen = false; // if listening for what influence player will reveal
        this.isChooseInfluenceOpen = false; // if listening for what influence to lose
        this.isExchangeOpen = false; // if listening for result of ambassador exchange;
        this.votes = 0;
        this.aliveCount = 0;
        this.isPlayAgainOpen = false;
    }

    resetGame(startingPlayer = 0): void {
        this.currentPlayer = startingPlayer;
        this.isChallengeBlockOpen = false;
        this.isRevealOpen = false;
        this.isChooseInfluenceOpen = false;
        this.isExchangeOpen = false;
        this.aliveCount = this.players.length;
        this.votes = 0;
        this.deck = gameUtils.buildDeck();
        for(let i = 0; i < this.players.length; i++) {
            this.players[i].money = 2;
            this.players[i].influences = [this.deck.pop(), this.deck.pop()];
            this.players[i].isDead = false;
        }
    }

    listen() {

        this.players.map(x => {
            const socket = this.gameSocket.sockets[x.socketID];
            socket.on('g-playAgain', () => {
                if(this.isPlayAgainOpen){
                    this.isPlayAgainOpen = false;
                    this.resetGame(Math.floor(Math.random() * (this.players.length)));
                    this.updatePlayers();
                    this.playTurn() 
                }
            })
            socket.on('g-deductCoins', (res) => {
                //res.amount res.source
                console.log('deducting ' + res.amount + ' coins from ' + res.source )
                const sourceIndex = this.nameIndexMap[res.source];
                this.players[sourceIndex].money -= res.amount;
                this.updatePlayers();

            })
            socket.on('g-actionDecision', (res) => {
                console.log(108, res)
                // res.action.target, res.action.action, res.action.source
                // console.log(bind.actions, res.action.action)
                if(Actions[res.action.action].isChallengeable) {
                    this.openChallenge(res.action, (Actions[res.action.action].blockableBy.length > 0))
                } else if(res.action.action == 'foreign_aid') {
                    this.isChallengeBlockOpen = true;
                    this.gameSocket.emit("g-openBlock", res.action);
                } else {
                    this.applyAction(res.action)
                }
            })
            socket.on('g-challengeDecision', (res) => {
                console.log(120, res)
                // res.action.action, res.action.target, res.action.source, res.challengee, res.challenger, res.isChallenging
                if(this.isChallengeBlockOpen) {
                    if(res.isChallenging) {
                        this.closeChallenge();
                        //TODO reveal
                        // reveal(action, counterAction, challengee, challenger, isBlock)
                        this.gameSocket.emit("g-addLog", `${res.challenger} challenged ${res.challengee}`)
                        this.reveal(res.action, null, res.challengee, res.challenger, false);
                    } else if(this.votes+1 == this.aliveCount-1) {
                        //then it is a pass
                        this.closeChallenge();
                        this.applyAction(res.action);
                    } else {
                        this.votes += 1;
                    }
                }
            });
            socket.on('g-blockChallengeDecision', (res) => {
                console.log(137, res)
                // res.counterAction, res.prevAction, res.challengee, res.challenger, res.isChallenging
                if(this.isChallengeBlockOpen) {
                    if(res.isChallenging) {
                        this.closeChallenge();
                        this.gameSocket.emit("g-addLog", `${res.challenger} challenged ${res.challengee}'s block`)
                        this.reveal(res.prevAction, res.counterAction, res.challengee, res.challenger, true);
                    } else if(this.votes+1 == this.aliveCount-1) {
                        //then it is a pass
                        this.closeChallenge();
                        this.nextTurn();
                    } else {
                        this.votes += 1;
                    }
                }
            });
            socket.on('g-blockDecision', (res) => {
                console.log(154, res)
                // res.prevAction.action, res.prevAction.target, res.prevAction.source, res.counterAction, res.blockee, res.blocker, res.isBlocking
                if(this.isChallengeBlockOpen) {
                    if(res.isBlocking) {
                        this.closeChallenge();
                        this.gameSocket.emit("g-addLog", `${res.blocker} blocked ${res.blockee}`)
                        this.openBlockChallenge(res.counterAction, res.blockee, res.prevAction);
                    } else if(this.votes+1 == this.aliveCount-1) {
                        //then it is a pass
                        this.closeChallenge();
                        this.applyAction(res.action);
                    } else {
                        this.votes += 1;
                    }
                }
            });
            socket.on('g-revealDecision', (res) => {
                console.log(171, res)
                console.log(res.isBlock)
                //if isBlock, prevaction should contain the prev action
                //if isBlock is false, prevaction is action
                // res.revealedCard, prevaction, counterAction, challengee, challenger, isBlock
                const challengeeIndex = this.nameIndexMap[res.challengee];
                const challengerIndex = this.nameIndexMap[res.challenger];
                if(this.isRevealOpen) {
                    this.isRevealOpen = false;
                    if(res.isBlock) { //block challenge
                        if(res.revealedCard == res.counterAction.claim || (res.counterAction.counterAction == 'block_steal' && (res.revealedCard == 'ambassador' || res.revealedCard =='captain'))) { //challenge failed
                            this.gameSocket.emit("g-addLog", `${res.challenger}'s challenge on ${res.challengee}'s block failed`);
                            this.loseInfluence(challengerIndex, res.revealedCard);
                            this.updatePlayers();
                            this.isChooseInfluenceOpen = true;
                            this.gameSocket.to(this.nameSocketMap[res.challenger]).emit('g-chooseInfluence');
                            this.nextTurn();
                        } else { //challenge succeeded
                            this.challengeSucceeded(res.challenger, res.challengee, res.revealedCard);
                            console.log(res.prevAction);
                            this.applyAction(res.prevAction);
                        }
                    } else { //normal challenge
                        if(res.revealedCard == Actions[res.prevAction.action].influence) { // challenge failed
                            this.gameSocket.emit("g-addLog", `${res.challenger}'s challenge on ${res.challengee} failed`);
                            this.loseInfluence(challengerIndex, res.revealedCard);
                            this.updatePlayers();
                            this.isChooseInfluenceOpen = true;
                            this.gameSocket.to(this.nameSocketMap[res.challenger]).emit('g-chooseInfluence');
                            this.applyAction(res.prevAction);
                            let card = this.deck.pop();
                            if (card) {
                                this.players[challengeeIndex].influences.push(card);
                            }
                        } else { // challenge succeeded
                            this.challengeSucceeded(res.challenger, res.challengee, res.revealedCard);
                            this.nextTurn();
                        }
                    }
                }
            });
            socket.on('g-chooseInfluenceDecision', (res) => {
                console.log(211, res)
                // res.influence, res.playerName
                const playerIndex = this.nameIndexMap[res.playerName];
                if(this.isChooseInfluenceOpen) {
                    this.gameSocket.emit("g-addLog", `${res.playerName} lost their ${res.influence}`);
                    this.loseInfluence(playerIndex, res.influence);
                    this.isChooseInfluenceOpen = false;
                    this.nextTurn();
                }
            })
            socket.on('g-chooseExchangeDecision', (res) => {
                console.log(228, res)
                // res.playerName, res.kept, res.putBack = ["influence","influence"]
                const playerIndex = this.nameIndexMap[res.playerName];
                if(this.isExchangeOpen) {
                    this.players[playerIndex].influences = res.kept;
                    this.deck.push(res.putBack[0]);
                    this.deck.push(res.putBack[1]);
                    gameUtils.shuffleArray(this.deck);
                    this.isExchangeOpen = false;
                    this.nextTurn();
                }
            })
        })
    }

    private loseInfluence(challengeeIndex: number, revealedCard: string): void {
        for(let i = 0; i < this.players[challengeeIndex].influences.length; i++) { // 
            if(this.players[challengeeIndex].influences[i] == revealedCard) {
                this.deck.push(this.players[challengeeIndex].influences[i]);
                gameUtils.shuffleArray(this.deck);
                this.players[challengeeIndex].influences.splice(i,1);
                console.log(`Removing: ${revealedCard} from ${this.players[challengeeIndex].name}`);
                return;
            }
        }
    }

    private challengeSucceeded(challenger: string, challengee: string, revealedCard: string) {
        this.gameSocket.emit("g-addLog", `${challenger}'s challenge on ${challengee} succeeded`);
        this.gameSocket.emit("g-addLog", `${challengee} lost their ${revealedCard}`);
        this.loseInfluence(this.nameIndexMap[challengee], revealedCard);
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
        let logTarget = '';
        if(action.target) {
            logTarget = ` on ${action.target}`;
        }
        this.gameSocket.emit("g-addLog", `${action.source} used ${action.action}${logTarget}`)
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
            this.isExchangeOpen = true;
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
        console.log(!this.isChallengeBlockOpen, !this.isChooseInfluenceOpen, !this.isExchangeOpen, !this.isRevealOpen)
        if(!this.isChallengeBlockOpen && !this.isChooseInfluenceOpen && !this.isExchangeOpen && !this.isRevealOpen){
        this.players.forEach(x => {
            console.log(x.influences)
            if(x.influences.length == 0 && !x.isDead) {// player is dead
                this.gameSocket.emit("g-addLog", `${x.name} is out!`)
                this.aliveCount-=1;
                x.isDead = true;
                x.money = 0;
            }
        });
        this.updatePlayers();
        if(this.aliveCount == 1) {
            let winner: undefined | string = undefined;
            for(let i = 0; i < this.players.length; i++) {
                if(this.players[i].influences.length > 0) {
                    winner = this.players[i].name; 
                }
            }
            this.isPlayAgainOpen = true;
            this.gameSocket.emit('g-gameOver', winner);
        } else {
            do {
                this.currentPlayer+=1;
                this.currentPlayer%=this.players.length;
            } while(this.players[this.currentPlayer].isDead == true);
            this.playTurn();
        }
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

    private findWinner(): string | undefined {
        for (let player of this.players) {
            if (player.influences.length > 0) {
                console.log(`${player.name} is the winner`);
                return player.name;
            }
        }
        console.log('Could not find a winner!');
        return undefined;
    }
    
}

module.exports = CoupGame;