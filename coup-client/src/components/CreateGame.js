import React, { Component } from 'react'
import io from "socket.io-client";
import { ReactSortable } from "react-sortablejs";

export default class CreateGame extends Component {



    constructor(props) {
        super(props)
    
        this.state = {
            roomCode: 'oneRoom',
            players: []
        }
    }
    
    componentDidMount(){
        const socket = io(`localhost:8000/${this.state.roomCode}`);
        socket.on('partyUpdate', (players) => {
            console.log(players)
            this.setState({ players })
        })
    }

    render() {
        return (
            <ReactSortable list={this.state.players} setList={newState => this.setState({ players: newState })}>
                {this.state.players.map((item,index) => (
                    <p key={index}>{item.name}</p>
                    ))}
            </ReactSortable>
        )
    }
}
