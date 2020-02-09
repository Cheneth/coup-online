import React, { Component } from 'react'

export default class Coup extends Component {

    constructor(props) {
        super(props)
    
        this.state = {
             action: ''
        }
    }
    
    actionDecision = () => {
        console.log('action!', this.props.socket)
        this.props.socket.emit('g-actionDecision', {
            name: this.props.name,
            action: this.state.action
        });
    }
    render() {
        return (
            <div>
                <p>{this.props.name}</p>
                <button onClick={this.actionDecision}></button>
            </div>
        )
    }
}
