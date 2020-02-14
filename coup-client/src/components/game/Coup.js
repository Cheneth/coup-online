import React, { Component } from 'react'

export default class Coup extends Component {

    constructor(props) {
        super(props)
    
        this.state = {
             action: '',
             players: [],
             currentPlayer: '',
             controlOptions: []
             
        }
    }

    componentDidMount() {
        const bind = this

        this.props.socket.on('g-updatePlayers', (players) => {
            bind.setState({ players });
        });
        this.props.socket.on('g-updateCurrentPlayer', (currentPlayer) => {
            bind.setState({ currentPlayer });
        });

        this.props.socket.on('g-chooseAction', () => {
            bind.setState(prevState => ({
                controlOptions: [...prevState.controlOptions, 'actionDecision']
            }))
        });
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
