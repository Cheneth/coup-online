import React, { Component } from 'react'

export default class ActionDecision extends Component {

    constructor(props) {
        super(props)
    
        this.state = {
            isDecisionMade: false,
            decision: '',
            isPickingTarget: false,
            targetAction: '',
            actionError: ''
        }
    }

    chooseAction = (action, target = null) => {
        const res = {
            action: {
                action: action,
                target: target,
                source: this.props.name
            }
        }
        console.log(res)
        
        this.props.socket.emit('g-actionDecision', res)
        this.props.doneAction();
    }

    deductCoins = (action) => {
        console.log(this.props.money, action)
        if(action === 'assassinate') {
            if(this.props.money >= 3) {
                this.props.deductCoins(3);
                this.pickingTarget('assassinate');
            } else {
                this.setState({ actionError: 'Not enough coins to assassinate!'})
            }
        } else if(action === 'coup') {
            if(this.props.money >= 7) {
                this.props.deductCoins(7);
                this.pickingTarget('coup');
            } else {
                this.setState({ actionError: 'Not enough coins to coup!'})
            }
        }
    }

    pickingTarget = (action) => {
        this.setState({isPickingTarget: true});
        this.setState({targetAction: action});
    }

    pickTarget = (target) => {
        this.chooseAction(this.state.targetAction, target);
    }

    render() {
        let controls = null
        if(this.state.isPickingTarget) {
            controls = this.props.players.filter(x => x !== this.props.name).map((x, index) => {
                return <button key={index} onClick={() => this.pickTarget(x)}>{x}</button>
            })
        } else {
           controls = ( 
           <>
                <button onClick={() => this.chooseAction('income')}>Income</button>
                <button onClick={() => this.deductCoins('coup')}>Coup</button>
                <button onClick={() => this.chooseAction('foreign_aid')}>Foreign Aid</button>
                <button onClick={() => this.pickingTarget('steal')}>Steal</button>
                <button onClick={() => this.deductCoins('assassinate')}>Assassinate</button>
                <button onClick={() => this.chooseAction('tax')}>Tax</button>
                <button onClick={() => this.chooseAction('exchange')}>Exchange</button>
                <p>{this.state.actionError}</p>
           </> 
           )
        }
        return (
            <div>
               {controls}
            </div>
        )
    }
}
