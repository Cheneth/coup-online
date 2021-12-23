import React, { Component } from 'react'

export default class ChooseInfluence extends Component {
    
    selectInfluence = (influence) => {
        // res.revealedCard, prevaction, counterAction, challengee, challenger, isBlock
        const res = {
            influence: influence,
            playerName: this.props.name
        }
        console.log(res)
        this.props.socket.emit('g-chooseInfluenceDecision', res);
        this.props.doneChooseInfluence();
    }

    render() {
        const influences = this.props.influences.map((x, index) => {
            return <button className={`${x}-color`} key={index} onClick={() => this.selectInfluence(x)}>{x}</button>
        })
        return ( 
            <>
                <p className="DecisionTitle">Choose an influence to lose </p>
                {influences}
            </>
        )
    }
}
