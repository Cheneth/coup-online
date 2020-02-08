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
            players: []
        }
    }
    
    componentDidMount(){
        const socket = io(`${baseUrl}/${this.state.roomCode}`);
        socket.on('partyUpdate', (players) => {
            console.log(players)
            this.setState({ players })
        })
    }

    onNameChange = (name) => {
        this.setState({ name });
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

        socket.on("leader", function() {
            console.log("You are the leader")
        })

        socket.on('partyUpdate', (players) => {
            console.log(players)
            this.setState({ players })
        })

        socket.on('disconnected', function() {
            console.log("You've lost connection with the server")
        });
    }

    createParty = () => {
        if(this.state.name === '') {
            //TODO  handle error
            console.log('Please enter a name');
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
                console.log("error in getting creating namespace", err);
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
                <button onClick={this.createParty}>Create</button>

                <ReactSortable list={this.state.players} setList={newState => this.setState({ players: newState })}>
                    {this.state.players.map((item,index) => (
                        <p key={index}>{item.name}</p>
                        ))}
                </ReactSortable>
            </div>
                
        )
    }
}
