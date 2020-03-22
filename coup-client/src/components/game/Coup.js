import React, { Component } from 'react'
import ActionDecision from './ActionDecision';
import ChallengeDecision from './ChallengeDecision';
import BlockChallengeDecision from './BlockChallengeDecision';
import PlayerBoard from './PlayerBoard';
import RevealDecision from './RevealDecision';
import BlockDecision from './BlockDecision';
import ChooseInfluence from './ChooseInfluence';
import ExchangeInfluences from './ExchangeInfluences';
import './CoupStyles.css';

export default class Coup extends Component {

    constructor(props) {
        super(props)
    
        this.state = {
             action: null,
             blockChallengeRes: null,
             players: [],
             playerIndex: null,
             currentPlayer: '',
             isChooseAction: false,
             revealingRes: null,
             blockingAction: null,
             isChoosingInfluence: false,
             exchangeInfluence: null,
             error: '',
             winner: ''
        }
        const bind = this;
        this.props.socket.on('g-gameOver', (winner) => {
            bind.setState({winner: `${winner} Wins!`})
        })
        this.props.socket.on('g-updatePlayers', (players) => {
            players = players.filter(x => !x.isDead);
            console.log(players)
            let playerIndex = null;
            for(let i = 0; i < players.length; i++) {
                console.log(players[i].name, this.props.name)
                if(players[i].name === this.props.name) {
                    playerIndex = i;
                    break;
                }
            }
            console.log(playerIndex)
            bind.setState({playerIndex, players});
            
        });
        this.props.socket.on('g-updateCurrentPlayer', (currentPlayer) => {
            console.log('currentPlayer: ', currentPlayer)
            bind.setState({ currentPlayer });
        });
        this.props.socket.on('g-chooseAction', () => {
            console.log(this.state.players, this.state.playerIndex)
        
            bind.setState({ isChooseAction: true})
        });
        this.props.socket.on('g-openExchange', (drawTwo) => {
            let influences = [...bind.state.players[bind.state.playerIndex].influences, ...drawTwo];
            bind.setState({ exchangeInfluence: influences });
        })
        this.props.socket.on('g-openChallenge', (action) => {
            if(action.source !== bind.props.name) {
               bind.setState({ action }) 
            } else {
                bind.setState({ action: null }) 
            }
        });
        this.props.socket.on('g-openBlockChallenge', (blockChallengeRes) => {
            if(blockChallengeRes.counterAction.source !== bind.props.name) {
               bind.setState({ blockChallengeRes }) 
            } else {
                bind.setState({ blockChallengeRes: null }) 
            }
        });
        this.props.socket.on('g-openBlock', (action) => {
            if(action.source !== bind.props.name) {
                bind.setState({ blockingAction: action })
             } else {
                 bind.setState({ blockingAction: null }) 
             }
        });
        this.props.socket.on('g-chooseReveal', (res) => {
            console.log(res)
            bind.setState({ revealingRes: res});
        });
        this.props.socket.on('g-chooseInfluence', () => {
            bind.setState({ isChoosingInfluence: true });
        });
        this.props.socket.on('g-closeChallenge', () => {
            bind.setState({ action: null });
        });
        this.props.socket.on('g-closeBlock', () => {
            bind.setState({ blockingAction: null });
        });
        this.props.socket.on('g-closeBlockChallenge', () => {
            bind.setState({ blockChallengeRes: null });
        });
    }

    deductCoins = (amount) => {
        let res = {
            source: this.props.name,
            amount: amount
        }
        this.props.socket.emit('g-deductCoins', res);
    }

    doneAction = () => {
        this.setState({ isChooseAction: false })
    }
    doneChallengeBlockingVote = () => {
        this.setState({ action: null });
        this.setState({ blockChallengeRes: null});
        this.setState({ blockingAction: null });
    }
    doneReveal = () => {
        this.setState({ revealingRes: null });
    }
    doneChooseInfluence = () => {
        this.setState({ isChoosingInfluence: false })
    }
    doneExchangeInfluence = () => {
        this.setState({ exchangeInfluence: null })
    }
    pass = () => {
        if(this.state.action != null) { //challengeDecision
            let res = {
                isChallenging: false,
                action: this.state.action
            }
            console.log(res)
            this.props.socket.emit('g-challengeDecision', res);
        }else if(this.state.blockChallengeRes != null) { //BlockChallengeDecision
            let res = {
                isChallenging: false
            }
            console.log(res)
            this.props.socket.emit('g-blockChallengeDecision', res);
        }else if(this.state.blockingAction !== null) { //BlockDecision
            const res = {
                action: this.state.blockingAction,
                isBlocking: false
            }
            console.log(res)
            this.props.socket.emit('g-blockDecision', res)
        }
        this.doneChallengeBlockingVote();
    }

    influenceColorMap = {
        duke: '#DD6C75',
        captain: '#80C6E5',
        assassin: '#2B2B2B',
        contessa: '#E35646',
        ambassador: '#B4CA1F'
    }
    
    render() {
        let actionDecision = null
        let currentPlayer = null
        let revealDecision = null
        let challengeDecision = null
        let blockChallengeDecision = null
        let chooseInfluenceDecision = null
        let blockDecision = null
        let influences = null
        let pass = null
        let coins = null
        let exchangeInfluences = null
        if(this.state.isChooseAction) {
            actionDecision = <ActionDecision doneAction={this.doneAction} deductCoins={this.deductCoins} name={this.props.name} socket={this.props.socket} money={this.state.players[this.state.playerIndex].money} players={this.state.players.map(x => x.name).filter(x => !x.isDead || x !== this.props.name)}></ActionDecision>
        }
        if(this.state.currentPlayer) {
            currentPlayer = <p>It is <b>{this.state.currentPlayer}</b>'s turn</p>
        }
        if(this.state.revealingRes) {
            revealDecision = <RevealDecision doneReveal={this.doneReveal} name ={this.props.name} socket={this.props.socket} res={this.state.revealingRes} influences={this.state.players.filter(x => x.name === this.props.name)[0].influences}></RevealDecision>
        }
        if(this.state.isChoosingInfluence) {
            chooseInfluenceDecision = <ChooseInfluence doneChooseInfluence={this.doneChooseInfluence} name ={this.props.name} socket={this.props.socket} influences={this.state.players.filter(x => x.name === this.props.name)[0].influences}></ChooseInfluence>
        }
        if(this.state.action != null || this.state.blockChallengeRes != null || this.state.blockingAction !== null){
            pass = <button onClick={() => this.pass()}>Pass</button>
        }
        if(this.state.action != null) {
            challengeDecision = <ChallengeDecision doneChallengeVote={this.doneChallengeBlockingVote} name={this.props.name} action={this.state.action} socket={this.props.socket} ></ChallengeDecision>
        }
        if(this.state.exchangeInfluence) {
            exchangeInfluences = <ExchangeInfluences doneExchangeInfluence={this.doneExchangeInfluence} name={this.props.name} influences={this.state.exchangeInfluence} socket={this.props.socket}></ExchangeInfluences>
        }
        if(this.state.blockChallengeRes != null) {
            blockChallengeDecision = <BlockChallengeDecision doneBlockChallengeVote={this.doneChallengeBlockingVote} name={this.props.name} prevAction={this.state.blockChallengeRes.prevAction} counterAction={this.state.blockChallengeRes.counterAction} socket={this.props.socket} ></BlockChallengeDecision>
        }
        if(this.state.blockingAction !== null) {
            blockDecision = <BlockDecision doneBlockVote={this.doneChallengeBlockingVote} name={this.props.name} action={this.state.blockingAction} socket={this.props.socket} ></BlockDecision>
        }
        if(this.state.playerIndex != null) {
            influences = this.state.players[this.state.playerIndex].influences.map(influence => {
                return  <div className="InfluenceUnitContainer">
                            <span className="circle" style={{backgroundColor: `${this.influenceColorMap[influence]}`}}></span>
                            <br></br>
                            <h3>{influence}</h3>
                        </div>
                
                })
            
            coins = <p>Coins: {this.state.players[this.state.playerIndex].money}</p>
        }
        return (
            <div className="GameContainer">
                <div className="GameHeader">
                    <div className="PlayerInfo">
                        <p>You are: {this.props.name}</p>
                        {coins}
                    </div>
                    <div className="CurrentPlayer">
                        {currentPlayer}
                    </div>
                    
                </div>
                <div className="InfluenceSection">
                    <p>Your Influences</p>
                    <br></br>
                    {influences}
                </div>
                <PlayerBoard players={this.state.players}></PlayerBoard>
                <br></br>
                <div className="DecisionsSection">
                    {revealDecision}
                    {chooseInfluenceDecision}
                    {actionDecision}
                    {exchangeInfluences}
                    {challengeDecision}
                    {blockChallengeDecision}
                    {blockDecision}
                    {pass}
                </div>
                <b>{this.state.winner}</b>
            </div>
        )
    }
}
