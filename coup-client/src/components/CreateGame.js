import React, { Component } from 'react'
import io from "socket.io-client";
import { ReactSortable } from "react-sortablejs";

const axios = require('axios');
const baseUrl = 'http://localhost:8000'

export default class CreateGame extends Component {

    constructor(props) {
        super(props)
    
        this.state = {
            name: '',
            roomCode: '',
            isInRoom: false,
            isLoading: false,
            players: [],
            isError: false,
            errorMsg: '',
            canStart: false,
            socket: null
        }
    }

    onNameChange = (name) => {
        this.setState({ name });
    }

    joinParty = () => {
        const bind = this
        const socket = io(`${baseUrl}/${this.state.roomCode}`);
        this.setState({ socket });
        console.log("socket created")
        socket.emit('setName', this.state.name);
        
        socket.on("joinSuccess", function() {
            console.log("join successful")
            bind.setState({ 
                isLoading: false,
                isInRoom: true
            });
        })

        socket.on("joinFailed", function(err) {
            console.log("join failed, cause: " + err);
            bind.setState({ isLoading: false });
        })

        socket.on("leader", function() {
            console.log("You are the leader")
        })

        socket.on('partyUpdate', (players) => {
            console.log(players)
            this.setState({ players })
            if(players.length >= 3 && players.map(x => x.isReady).filter(x => x === true).length === players.length) {
                this.setState({ canStart: true })
            } else {
                this.setState({ canStart: false })
            }
        })

        socket.on('disconnected', function() {
            console.log("You've lost connection with the server")
        });
    }

    createParty = () => {
        if(this.state.name === '') {
            //TODO  handle error
            console.log('Please enter a name');
            this.setState({ errorMsg: 'Please enter a name' });
            this.setState({ isError: true });
            return
        }

        this.setState({ isLoading: true });
        const bind = this;
        axios.get(`${baseUrl}/createNamespace`)
            .then(function (res) {
                console.log(res);
                bind.setState({ roomCode: res.data.namespace });
                bind.joinParty();
            })
            .catch(function (err) {
                //TODO  handle error
                console.log("error in creating namespace", err);
                bind.setState({ isLoading: false });
                bind.setState({ errorMsg: 'Error creating room' });
                bind.setState({ isError: true });
            })
    }

    render() {
        let error = null;
        let roomCode = null;
        let startGame = null
        if(this.state.isError) {
            error = <b>{this.state.errorMsg}</b>
        }
        if(this.state.roomCode !== '') {
            roomCode = <>
                    <p>ROOM CODE: <b>{this.state.roomCode}</b></p>
                </>
        }
        if(this.state.canStart) {
            startGame = <button >Start Game</button>
        }
        return (
            <div>
                <p>Your Name</p>
                <input
                    type="text" value={this.state.name} disabled={this.state.isLoading}
                    onChange={e => this.onNameChange(e.target.value)}
                />
                <button onClick={this.createParty} disabled={this.state.isLoading || this.state.isInRoom}>Create</button>
                <br></br>
                {error}
                <br></br>
                {roomCode}

                <ReactSortable list={this.state.players} setList={newState => this.setState({ players: newState })}>
                    {this.state.players.map((item,index) => {
                        let ready = null
                        if(item.isReady) {
                            ready = <b style={{ color: 'green' }}>Ready!</b>
                        } else {
                            ready = <b style={{ color: 'red' }}>Not Ready</b>
                        }
                        return (
                            <div key={index}>
                                <p >{item.name} {ready}</p>
                            </div>)
                        })
                    }
                </ReactSortable>
                {startGame}
            </div>
                
        )
    }
}
