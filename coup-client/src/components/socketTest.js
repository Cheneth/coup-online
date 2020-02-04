import React, { Component } from 'react'
import socketIOClient from "socket.io-client";

const socket = socketIOClient('localhost:8000');

export default class socketTest extends Component {

    constructor() {
        super();
        this.state = {
          time: 'test'
        //   display: ''
        };
      }

    doShit = () =>  {
        socket.on('connect', function() {
            // Connected, let's sign-up for to receive messages for this room
            socket.emit('room', '1234');
         });
        socket.on("time", data => this.setState({ time: data }));
        console.log('do shit')
    }

    render() {
        return (
            <div>
                <button onClick={this.doShit}>{this.state.time}</button>
            </div>
        )
    }
}
