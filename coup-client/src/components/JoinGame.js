import React, { Component } from 'react'
import io from "socket.io-client";

const axios = require('axios');
const baseUrl = 'http://localhost:8000'

export default class JoinGame extends Component {

    constructor(props) {
        super(props)
    
        this.state = {
            name: '',
            roomCode: '',
            isInRoom: false,
            isLoading: false
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
        console.log("socket created")
        socket.emit('setName', this.state.name);
        
        socket.on("joinSuccess", function() {
            console.log("join successful")
            bind.setState({ isLoading: false });
        })

        socket.on("joinFailed", function(err) {
            console.log("join failed, cause: " + err);
            bind.setState({ isLoading: false });
        })

        socket.on('disconnected', function() {
            console.log("You've lost connection with the server")
        });
    }

    attemptJoinParty = () => {

        if(this.state.name === '') {
            //TODO  handle error
            console.log('Please enter a name');
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
                    bind.joinParty();
                } else {
                    //TODO  handle error
                    console.log('Invalid Party Code')
                    bind.setState({ isLoading: false });
                }
            })
            .catch(function (err) {
                //TODO  handle error
                console.log("error in getting exists", err);
                bind.setState({ isLoading: false });
            })
    }
    
    render() {
        return (
            <div>
                <p>Your Name</p>
                <input
                    type="text" value={this.state.name} disabled={this.state.isLoading}
                    onChange={e => this.onNameChange(e.target.value)}
                />
                <p>Room Code</p>
                <input
                    type="text" value={this.state.roomCode} disabled={this.state.isLoading}
                    onChange={e => this.onCodeChange(e.target.value)}
                />
                <button onClick={this.attemptJoinParty}>Join</button>
            </div>
        )
    }
}
