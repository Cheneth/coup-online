import React, { Component } from 'react'
import { withTranslation } from 'react-i18next';
import io from "socket.io-client";
import Coup from './game/Coup';

const axios = require('axios');
const baseUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000' 

class JoinGame extends Component {

    constructor(props) {
        super(props)
    
        this.state = {
            name: '',
            roomCode: '',
            players: [],
            isInRoom: false,
            isReady: false,
            isLoading: false,
            isError: false,
            isGameStarted: false,
            errorMsg: '',
            socket: null
        }
    }

    onNameChange = (name) => {
        this.setState({ name });
    }

    onCodeChange = (roomCode) => {
        this.setState({ roomCode });
    }

    joinParty = () => {
        const bind = this
        const socket = io(`${baseUrl}/${this.state.roomCode}`);
        this.setState({ socket });
        console.log("socket created")
        socket.emit('setName', this.state.name);
        
        socket.on("joinSuccess", function() {
            console.log("join successful")
            // bind.setState({ isLoading: false });
            bind.setState({ isInRoom: true })
        })

        socket.on("joinFailed", function(err) {
            console.log("join failed, cause: " + err);
            bind.setState({ 
                errorMsg: err,
                isError: true,
                isLoading: false
            });
            socket.disconnect();
        })

        socket.on('startGame', () => {
            this.setState({ isGameStarted: true});
        })

        socket.on('partyUpdate', (players) => {
            console.log(players)
            this.setState({ players })
            if(players.length >= 3 && players.map(x => x.isReady).filter(x => x === true).length === players.length) { //TODO CHANGE 2 BACK TO 3
                this.setState({ canStart: true })
            } else {
                this.setState({ canStart: false })
            }
        })


        socket.on('disconnected', function() {
            console.log("You've lost connection with the server")
        });
    }

    attemptJoinParty = () => {
        const { t } = this.props;
        if(this.state.name === '') {
            //TODO  handle error
            console.log('Please enter a name');
            this.setState({ 
                errorMsg: t('join.enterName'),
                isError: true 
            });
            return
        }
        if(this.state.roomCode === '') {
            //TODO  handle error
            console.log('Please enter a room code');
            this.setState({ 
                errorMsg: t('join.enterRoomCode'),
                isError: true
            });
            return
        }

        this.setState({ isLoading: true });
        const bind = this
        axios.get(`${baseUrl}/exists/${this.state.roomCode}`)
            .then(function (res) {
                console.log(res)
                if(res.data.exists) {
                    //join 
                    console.log("joining")
                    bind.setState({errorMsg: ''})
                    bind.joinParty();
                } else {
                    //TODO  handle error
                    console.log('Invalid Party Code')
                    bind.setState({ 
                        isLoading: false,
                        errorMsg: t('join.invalidRoomCode'),
                        isError: true
                    });
                }
            })
            .catch(function (err) {
                //TODO  handle error
                console.log("error in getting exists", err);
                bind.setState({ 
                    isLoading: false,
                    errorMsg: t('join.serverError'),
                    isError: true
                });
            })
    }
    
    reportReady = () => {
        this.state.socket.emit('setReady', true);
        this.state.socket.on('readyConfirm', () => {
            this.setState({ isReady: true })
        })
    }

    render() {
        const { t } = this.props;
        if(this.state.isGameStarted) {
            return (<Coup name={this.state.name} socket={this.state.socket}></Coup>);
        }
        let error = null;
        let joinReady = null;
        let ready = null;
        if(this.state.isError) {
            error = <b>{this.state.errorMsg}</b>
        }
        if(this.state.isInRoom) {
            joinReady = <button className="joinButton" onClick={this.reportReady} disabled={this.state.isReady}>{t('join.ready')}</button>
        } else {
            joinReady = <button className="joinButton" onClick={this.attemptJoinParty} disabled={this.state.isLoading}>{this.state.isLoading ? t('join.joining'): t('join.join')}</button>
        }
        if(this.state.isReady) {
            ready = <b style={{ color: '#5FC15F' }}>{t('join.selfReady')}</b>
            joinReady = null
        }

        return (
            <div className="joinGameContainer">
                <p>{t('join.yourName')}</p>
                <input
                    type="text" value={this.state.name} disabled={this.state.isLoading}
                    onChange={e => {
                        if(e.target.value.length <= 8){
                            this.setState({
                                errorMsg: '',
                                isError: false
                            })
                            this.onNameChange(e.target.value);
                        } else {
                            this.setState({
                                errorMsg: t('join.nameLengthValidation'),
                                isError: true
                            })
                        }
                    }}
                />
                <p>{t('join.roomCode')}</p>
                <input
                    type="text" value={this.state.roomCode} disabled={this.state.isLoading}
                    onChange={e => this.onCodeChange(e.target.value)}
                />
                <br></br>
                {joinReady}
                <br></br>
                {ready}
                <br></br>
                {error}
                <div className="readyUnitContainer">
                        {this.state.players.map((item,index) => {
                            let ready = null
                            let readyUnitColor = '#E46258'
                            if(item.isReady) {
                                ready = <b>{t('join.ready')}</b>
                                readyUnitColor = '#73C373'
                            } else {
                                ready = <b>{t('join.notReady')}</b>
                            }
                            return (
                                    <div className="readyUnit" style={{backgroundColor: readyUnitColor}} key={index}>
                                        <p >{index+1}. {item.name} {ready}</p>
                                    </div>
                            )
                            })
                        }
                </div>
            </div>
        )
    }
}

export default withTranslation()(JoinGame);
