import React, { Component } from 'react'

export default class ExchangeInfluences extends Component {
    
    constructor(props) {
        super(props)
        console.log(props.influences)
        this.state = {
             influences: props.influences,
             putBack: []
        }
    }
    

    selectInfluence = (index) => {
        // res.revealedCard, prevaction, counterAction, challengee, challenger, isBlock
        this.state.putBack.push(this.state.influences.splice(index,1)[0])
        this.setState({ influences: this.state.influences, putBack: this.state.putBack })
        if(this.state.putBack.length === 2) {
            const res = {
                playerName: this.props.name,
                kept: this.state.influences,
                putBack: this.state.putBack
            }
            console.log(res);
            this.props.socket.emit('g-chooseExchangeDecision', res);
            this.props.doneExchangeInfluence();
        }
    }

    render() {
        const influences = this.state.influences.map((x, index) => {
            return <button key={index} onClick={() => this.selectInfluence(index)}>{x}</button>
        })
        return ( 
            <div>
                <p>Choose which influences to put back</p>
                {influences}
            </div>
        )
    }
}
