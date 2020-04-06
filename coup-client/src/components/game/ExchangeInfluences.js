import React, { Component } from 'react'

export default class ExchangeInfluences extends Component {
    
    constructor(props) {
        super(props)
        this.state = {
             influences: props.influences,
             keep: [],
             totalInf: props.influences.length
        }
    }
    

    selectInfluence = (index) => {
        // res.revealedCard, prevaction, counterAction, challengee, challenger, isBlock
        this.state.keep.push(this.state.influences.splice(index,1)[0])
        this.setState({ influences: this.state.influences, putBack: this.state.putBack })
        if(this.state.keep.length === (this.state.totalInf-2)) {
            const res = {
                playerName: this.props.name,
                kept: this.state.keep,
                putBack: this.state.influences
            }
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
                <p className="DecisionTitle">Choose which influence(s) to keep</p>
                {influences}
            </div>
        )
    }
}
