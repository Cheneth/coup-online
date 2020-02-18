import React, { Component } from 'react'
import ActionDecision from './ActionDecision';
import ChallengeDecision from './ChallengeDecision';
import PlayerBoard from './PlayerBoard';
import RevealDecision from './RevealDecision';
import BlockDecision from './BlockDecision';

export default class Coup extends Component {

    constructor(props) {
        super(props)
    
        this.state = {
             action: null,
             players: [],
             currentPlayer: '',
             isChooseAction: false,
             revealingRes: null,
             blockingAction: null,
        }
        const bind = this;
        this.props.socket.on('g-updatePlayers', (players) => {
            bind.setState({ players });
        });
        this.props.socket.on('g-updateCurrentPlayer', (currentPlayer) => {
            console.log('currentPlayer: ', currentPlayer)
            bind.setState({ currentPlayer });
        });
        this.props.socket.on('g-chooseAction', () => {
            bind.setState({ isChooseAction: true})
        });
        this.props.socket.on('g-openChallenge', (action) => {
            if(action.source !== bind.props.name) {
               bind.setState({ action }) 
            } else {
                bind.setState({ action: null }) 
            }
        });
        this.props.socket.on('g-openBlock', (action) => {
            console.log(action)
            bind.setState({ blockingAction: action })
        });
        this.props.socket.on('g-chooseReveal', (res) => {
            console.log(res)
            bind.setState({ revealingRes: res});
        });
        this.props.socket.on('g-closeChallenge', () => {
            bind.setState({ action: null });
        });
        this.props.socket.on('g-closeChallengeBlock', () => {
            bind.setState({ action: null });
        });
    }

    doneAction = () => {
        this.setState({ isChooseAction: false })
    }
    doneChallengeBlockingVote = () => {
        this.setState({ action: null });
        this.setState({ blockingAction: null });
    }
    doneReveal = () => {
        this.setState({ revealingRes: null });
    }
    
    render() {
        let actionDecision = null
        let currentPlayer = null
        let revealDecision = null
        let challengeDecision = null
        let blockDecision = null
        if(this.state.isChooseAction) {
            actionDecision = <ActionDecision doneAction={this.doneAction} name={this.props.name} socket={this.props.socket} players={this.state.players.map(x => x.name).filter(x => !x.isDead || x !== this.props.name)}></ActionDecision>
        }
        if(this.state.currentPlayer) {
            currentPlayer = <p>It is <b>{this.state.currentPlayer}</b>'s turn</p>
        }
        if(this.state.revealingRes) {
            revealDecision = <RevealDecision doneReveal={this.doneReveal} name ={this.props.name} socket={this.props.socket} res={this.state.revealingRes} influences = {this.state.players.filter(x => x.name === this.props.name)[0].influences}></RevealDecision>
        }
        if(this.state.action != null) {
            challengeDecision = <ChallengeDecision doneChallengeVote={this.doneChallengeBlockingVote} name={this.props.name} action={this.state.action} socket={this.props.socket} ></ChallengeDecision>
        }
        if(this.state.blockingAction !== null) {
            blockDecision = <BlockDecision doneBlockVote={this.doneChallengeBlockingVote} name={this.props.name} action={this.state.blockingAction} socket={this.props.socket} ></BlockDecision>
        }
        return (
            <div>
                <p>You are: {this.props.name}</p>
                {currentPlayer}
                <PlayerBoard players={this.state.players}></PlayerBoard>
                <br></br>
                {revealDecision}
                {actionDecision}
                {challengeDecision}
                {blockDecision}
            </div>
        )
    }
}
