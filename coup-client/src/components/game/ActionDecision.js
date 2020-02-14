import React, { Component } from 'react'

export default class ActionDecision extends Component {

    constructor(props) {
        super(props)
    
        this.state = {
             isDecisionMade: false,
             decision: ''
        }
    }
    
    

    render() {
        return (
            <div>
                <button onClick={this.chooseAction('income')}>Income</button>
                <button onClick={this.pickTarget('coup')}>Coup</button>
                <button onClick={this.chooseAction('foreign-aid')}>Foreign Aid</button>
                <button onClick={this.pickTarget('steal')}>Steal</button>
                <button onClick={this.pickTarget('assassinate')}>Assassinate</button>
                <button onClick={this.chooseAction('tax')}>Tax</button>
                <button onClick={this.chooseAction('exchange')}>Exchange</button>
            </div>
        )
    }
}
