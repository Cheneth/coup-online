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
import EventLog from './EventLog';
import ReactModal from 'react-modal';
import CheatSheet from '../../assets/CheatSheet.svg'

export default class Coup extends Component {

    constructor(props) {
        super(props)
    
        this.state = {
             showRulesModal: false,
             showCheatSheetModal: false,
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
             winner: '',
             playAgain: null,
             logs: [],
             isDead: false,
             waiting: true
        }
        const bind = this;

        this.playAgainButton = <>
        <br></br>
        <button className="startGameButton" onClick={() => {
            this.props.socket.emit('g-playAgain');
        }}>Play Again</button>
        </>

        this.props.socket.on('g-gameOver', (winner) => {
            bind.setState({winner: `${winner} Wins!`})
            bind.setState({playAgain: bind.playAgainButton})
        })
        this.props.socket.on('g-updatePlayers', (players) => {
            bind.setState({playAgain: null})
            bind.setState({winner: null})
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
            if(playerIndex == null) {
                this.setState({ isDead: true })
            }else {
                this.setState({ isDead: false})
            }
            console.log(playerIndex)
            bind.setState({playerIndex, players});
            
        });
        this.props.socket.on('g-updateCurrentPlayer', (currentPlayer) => {
            console.log('currentPlayer: ', currentPlayer)
            bind.setState({ currentPlayer });
        });
        this.props.socket.on('g-addLog', (log) => {
            bind.state.logs = [...bind.state.logs, log]
            if(bind.state.logs.length === 5){
                bind.state.logs.shift();
            }
            bind.setState({logs :bind.state.logs})
        })
        this.props.socket.on('g-chooseAction', () => {
            console.log(this.state.players, this.state.playerIndex)
        
            bind.setState({ isChooseAction: true})
        });
        this.props.socket.on('g-openExchange', (drawTwo) => {
            let influences = [...bind.state.players[bind.state.playerIndex].influences, ...drawTwo];
            bind.setState({ exchangeInfluence: influences });
        })
        this.props.socket.on('g-openChallenge', (action) => {
            if(this.state.isDead) {
                return
            }
            if(action.source !== bind.props.name) {
               bind.setState({ action }) 
            } else {
                bind.setState({ action: null }) 
            }
        });
        this.props.socket.on('g-openBlockChallenge', (blockChallengeRes) => {
            if(this.state.isDead) {
                return
            }
            if(blockChallengeRes.counterAction.source !== bind.props.name) {
               bind.setState({ blockChallengeRes }) 
            } else {
                bind.setState({ blockChallengeRes: null }) 
            }
        });
        this.props.socket.on('g-openBlock', (action) => {
            if(this.state.isDead) {
                return
            }
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

    handleOpenRulesModal = () => {
        this.setState({ showRulesModal: true });
    }

    handleCloseRulesModal = () => {
        this.setState({ showRulesModal: false });
    }

    handleOpenCheatSheetModal = () => {
        this.setState({ showCheatSheetModal: true });
    }

    handleCloseCheatSheetModal = () => {
        this.setState({ showCheatSheetModal: false });
    }

    deductCoins = (amount) => {
        let res = {
            source: this.props.name,
            amount: amount
        }
        this.props.socket.emit('g-deductCoins', res);
    }

    doneAction = () => {
        this.setState({ 
            isChooseAction: false
        })
    }
    doneChallengeBlockingVote = () => {
        this.setState({ action: null }); //challemge
        this.setState({ blockChallengeRes: null}); //challenge a block
        this.setState({ blockingAction: null }); //block
    }
    closeOtherVotes = (voteType) => {
        if(voteType === 'challenge') {
            this.setState({ blockChallengeRes: null}); //challenge a block
            this.setState({ blockingAction: null }); //block
        }else if(voteType === 'block') {
            this.setState({ action: null }); //challemge
            this.setState({ blockChallengeRes: null}); //challenge a block
        }else if(voteType === 'challenge-block') {
            this.setState({ action: null }); //challemge
            this.setState({ blockingAction: null }); //block
        }
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
        duke: '#D55DC7',
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
        let playAgain = null
        let isWaiting = true
        let waiting = null
        if(this.state.isChooseAction && this.state.playerIndex != null) {
            isWaiting = false;
            actionDecision = <ActionDecision doneAction={this.doneAction} deductCoins={this.deductCoins} name={this.props.name} socket={this.props.socket} money={this.state.players[this.state.playerIndex].money} players={this.state.players}></ActionDecision>
        }
        if(this.state.currentPlayer) {
            currentPlayer = <p>It is <b>{this.state.currentPlayer}</b>'s turn</p>
        }
        if(this.state.revealingRes) {
            isWaiting = false;
            revealDecision = <RevealDecision doneReveal={this.doneReveal} name ={this.props.name} socket={this.props.socket} res={this.state.revealingRes} influences={this.state.players.filter(x => x.name === this.props.name)[0].influences}></RevealDecision>
        }
        if(this.state.isChoosingInfluence) {
            isWaiting = false;
            chooseInfluenceDecision = <ChooseInfluence doneChooseInfluence={this.doneChooseInfluence} name ={this.props.name} socket={this.props.socket} influences={this.state.players.filter(x => x.name === this.props.name)[0].influences}></ChooseInfluence>
        }
        if(this.state.action != null || this.state.blockChallengeRes != null || this.state.blockingAction !== null){
            pass = <button onClick={() => this.pass()}>Pass</button>
        }
        if(this.state.action != null) {
            isWaiting = false;
            challengeDecision = <ChallengeDecision closeOtherVotes={this.closeOtherVotes} doneChallengeVote={this.doneChallengeBlockingVote} name={this.props.name} action={this.state.action} socket={this.props.socket} ></ChallengeDecision>
        }
        if(this.state.exchangeInfluence) {
            isWaiting = false;
            exchangeInfluences = <ExchangeInfluences doneExchangeInfluence={this.doneExchangeInfluence} name={this.props.name} influences={this.state.exchangeInfluence} socket={this.props.socket}></ExchangeInfluences>
        }
        if(this.state.blockChallengeRes != null) {
            isWaiting = false;
            blockChallengeDecision = <BlockChallengeDecision closeOtherVotes={this.closeOtherVotes} doneBlockChallengeVote={this.doneChallengeBlockingVote} name={this.props.name} prevAction={this.state.blockChallengeRes.prevAction} counterAction={this.state.blockChallengeRes.counterAction} socket={this.props.socket} ></BlockChallengeDecision>
        }
        if(this.state.blockingAction !== null) {
            isWaiting = false;
            blockDecision = <BlockDecision closeOtherVotes={this.closeOtherVotes} doneBlockVote={this.doneChallengeBlockingVote} name={this.props.name} action={this.state.blockingAction} socket={this.props.socket} ></BlockDecision>
        }
        if(this.state.playerIndex != null) {
            influences = this.state.players[this.state.playerIndex].influences.map((influence, index) => {
                return  <div key={index} className="InfluenceUnitContainer">
                            <span className="circle" style={{backgroundColor: `${this.influenceColorMap[influence]}`}}></span>
                            <br></br>
                            <h3>{influence}</h3>
                        </div>
                })
            
            coins = <p>Coins: {this.state.players[this.state.playerIndex].money}</p>
        }
        if(isWaiting) {
            waiting = <p>Waiting for other players...</p>
        }
        return (
            <div className="GameContainer">
            <ReactModal 
            isOpen={this.state.showRulesModal}
            contentLabel="Minimal Modal Example"
            onRequestClose={this.handleCloseRulesModal}
            shouldCloseOnOverlayClick={true}
            >
            <div className="CloseModalButtonContainer">
                <button className="CloseModalButton" onClick={this.handleCloseRulesModal}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 21 21">
                        <g id="more_info" data-name="more info" transform="translate(-39 -377)">
                            <g id="Ellipse_1" data-name="Ellipse 1" class="cls-5" transform="translate(39 377)">
                            <circle class="cls-7" cx="10.5" cy="10.5" r="10.5"/>
                            <circle class="cls-8" cx="10.5" cy="10.5" r="10"/>
                            </g>
                            <text id="x" class="cls-6" transform="translate(46 391)"><tspan x="0" y="0">x</tspan></text>
                        </g>
                    </svg>
                </button>
            </div>
           
            <div className="RulesContainer">
                <div className="RulesContent">
                    <h2>Rules</h2>
                    <p>On your turn, you may choose an action to play. The action you choose may or may not correspond to the influences that you possess. 
                        For the action that you choose, other players may potentially block or challenge it. </p>
                    <p><b>Challenge</b>: When a player declares an action they are declaring to the rest of the players that they have a certain influence, 
                        and any other player can challenge it. When a player is challenged, the challenged player must reveal the correct influence 
                        associated with their action. If they reveal the correct influence, the challenger player will lose an influence. However, 
                        if they fail to reveal the correct influence the challenged player will lose their incorrectly revealed influence.</p>
                    <p><b>Block</b>: When the any of the actions "Foreign Aid", "Steal", and "Assasinate" are used, they can be blocked. Once again, 
                        any player can claim to have the correct influence to block. However, blocks can also be challenged by any player. If a block 
                        fails, the original action will take place.
                    </p>
                    <p>
                        If a player loses all their influences, they are out of the game. The last player standing wins!
                    </p>
                    <p>
                        At this time, if a player disconnects, the game must be recreated.
                    </p>
                    <h2>Influences</h2>
                    <h3>Captain</h3>
                    <p><b id="captain-color">STEAL</b>: Steal 2 coins from a target. Blockable by <hl id="captain-color">Captain</hl> or <hl id="ambassador-color">Ambassador</hl>. Can block <hl id="captain-color">STEAL</hl></p>
                    <h3>Assassin</h3>
                    <p><b id="assassin-color">ASSASSINATE</b>: Pay 3 coins to choose a target to assassinate (target loses an influence). Blockable by <hl id="contessa-color">Contessa</hl>.</p>
                    <h3>Duke</h3>
                    <p><b id="duke-color">TAX</b>: Collect 3 coins from the treasury. Not blockable. Can block Foreign Aid.</p>
                    <h3>Ambassador</h3>
                    <p><b id="ambassador-color">EXCHANGE</b>: Draw 2 influences into your hand and pick any 2 influences to put back. Not blockable. Can block <hl id="captain-color">STEAL</hl></p>
                    <h3>Contessa</h3>
                    <p><b id="contessa-color">BLOCK ASSASSINATION</b>: Can block <b id="assassin-color">assassinations</b>. Not blockable.</p>
                    <h3>Other Actions</h3>
                    <p><b>INCOME</b>: Collect 1 coins from the treasury.</p>
                    <p><b>FOREIGN AID</b>: Collect 2 coins from the treasury. Blockable by <hl id="duke-color">Duke</hl>.</p>
                    <p><b>COUP</b>: Pay 7 coins and choose a target to lose an influence. If a player starts their turn with 10 coins, they must Coup. Not Blockable.</p>
                </div>
            </div>
            </ReactModal>
            <ReactModal 
            isOpen={this.state.showCheatSheetModal}
            contentLabel="Minimal Modal Example"
            onRequestClose={this.handleCloseCheatSheetModal}
            shouldCloseOnOverlayClick={true}
            className="CheatSheetModal"
            >
            <div className="CloseModalButtonContainer">
                <button className="CloseModalButton" onClick={this.handleCloseCheatSheetModal}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 21 21">
                        <g id="more_info" data-name="more info" transform="translate(-39 -377)">
                            <g id="Ellipse_1" data-name="Ellipse 1" class="cls-5" transform="translate(39 377)">
                            <circle class="cls-7" cx="10.5" cy="10.5" r="10.5"/>
                            <circle class="cls-8" cx="10.5" cy="10.5" r="10"/>
                            </g>
                            <text id="x" class="cls-6" transform="translate(46 391)"><tspan x="0" y="0">x</tspan></text>
                        </g>
                    </svg>
                </button>
            </div>
           
            <div className="CheatSheetContainer">
                <img src={CheatSheet} alt="Cheat-Sheet"/>
            </div>
            </ReactModal>
                <div className="GameHeader">
                    <div className="PlayerInfo">
                        <p>You are: {this.props.name}</p>
                        {coins}
                    </div>
                    <div className="CurrentPlayer">
                        {currentPlayer}
                    </div>
                    <div className="Rules" onClick={this.handleOpenRulesModal}>
                        <p>Rules</p>  
                        <svg className="InfoIcon"xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 21 22">
                            <g id="more_info" data-name="more info" transform="translate(-39 -377)">
                                <g id="Ellipse_1" data-name="Ellipse 1" className="cls-1" transform="translate(39 377)">
                                <circle className="cls-3" cx="10.5" cy="10.5" r="10.5"/>
                                <circle className="cls-4" cx="10.5" cy="10.5" r="10"/>
                                </g>
                                <text id="i" className="cls-2" transform="translate(48 393)"><tspan x="0" y="0">i</tspan></text>
                            </g>
                        </svg>
                    </div>
                    <div className="CheatSheet" onClick={this.handleOpenCheatSheetModal}>
                        <p>Cheat Sheet</p>  
                        <svg className="InfoIcon"xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 21 22">
                            <g id="more_info" data-name="more info" transform="translate(-39 -377)">
                                <g id="Ellipse_1" data-name="Ellipse 1" className="cls-1" transform="translate(39 377)">
                                <circle className="cls-3" cx="10.5" cy="10.5" r="10.5"/>
                                <circle className="cls-4" cx="10.5" cy="10.5" r="10"/>
                                </g>
                                <text id="i" className="cls-2" transform="translate(48 393)"><tspan x="0" y="0">i</tspan></text>
                            </g>
                        </svg>
                    </div>
                    <EventLog logs={this.state.logs}></EventLog>
                </div>
                <div className="InfluenceSection">
                    <p>Your Influences</p>
                    {influences}
                </div>
                <PlayerBoard players={this.state.players}></PlayerBoard>
                <div className="DecisionsSection">
                    {waiting}
                    {revealDecision}
                    {chooseInfluenceDecision}
                    {actionDecision}
                    {exchangeInfluences}
                    {challengeDecision}
                    {blockChallengeDecision}
                    {blockDecision}
                    {pass}
                    {playAgain}
                </div>
                <b>{this.state.winner}</b>
                {this.state.playAgain}
            </div>
        )
    }
}
