import React, { Component } from 'react'
import socketIOClient from "socket.io-client";


export default class socketTest extends Component {

    constructor() {
        super();
        this.state = {
          time: 'test'
        };
      }

    doShit = () =>  {
        const socket = socketIOClient('localhost:8000');
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
