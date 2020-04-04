import React, { Component } from 'react'
import io from "socket.io-client";
import Coup from './game/Coup';

const axios = require('axios');
const baseUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000' 

export default class JoinGame extends Component {

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

        if(this.state.name === '') {
            //TODO  handle error
            console.log('Please enter a name');
            this.setState({ 
                errorMsg: 'Please enter a name',
                isError: true 
            });
            return
        }
        if(this.state.roomCode === '') {
            //TODO  handle error
            console.log('Please enter a room code');
            this.setState({ 
                errorMsg: 'Please enter a room code',
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
                        errorMsg: 'Invalid Party Code',
                        isError: true
                    });
                }
            })
            .catch(function (err) {
                //TODO  handle error
                console.log("error in getting exists", err);
                bind.setState({ 
                    isLoading: false,
                    errorMsg: 'Server error',
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
            joinReady = <button className="joinButton" onClick={this.reportReady} disabled={this.state.isReady}>Ready</button>
        } else {
            joinReady = <button className="joinButton" onClick={this.attemptJoinParty} disabled={this.state.isLoading}>{this.state.isLoading ? 'Joining...': 'Join'}</button>
        }
        if(this.state.isReady) {
            ready = <b style={{ color: '#5FC15F' }}>You are ready!</b>
            joinReady = null
        }

        return (
            <div className="joinGameContainer">
                <p>Your Name</p>
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
                                errorMsg: 'Name must be less than 9 characters',
                                isError: true
                            })
                        }
                    }}
                />
                <p>Room Code</p>
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
                                ready = <b>Ready!</b>
                                readyUnitColor = '#73C373'
                            } else {
                                ready = <b>Not Ready</b>
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
