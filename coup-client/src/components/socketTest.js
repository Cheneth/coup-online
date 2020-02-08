import React, { Component } from 'react'
import io from "socket.io-client";
import faker from "faker"

// const socket = io('localhost:8000/oneRoom');

export default class socketTest extends Component {

    constructor() {
        super();
        this.state = {
          time: 'test'
        //   display: ''
        };
      }

    componentDidMount(){
        const socket = io('localhost:8000/GY6STH');
        console.log('mounted')
        socket.emit('setName', faker.name.findName())
        socket.on("time", data => {
            console.log('got')
            this.setState({ time: data })
        });
        socket.on('disconnected', function() {
            socket.emit('playerDisconnect', socket.socket.sessionid);
        });
    }

    doShit = () =>  {
        console.log('do shit')
    }

    render() {
        return (
            <div>
                <p>{this.state.time}</p>
                {/* <button onClick={this.doShit}>{this.state.time}</button> */}
            </div>
        )
    }
}
