import React, { Component } from 'react'

export default class ActionDecision extends Component {

    constructor(props) {
        super(props)
    
        this.state = {
            isDecisionMade: false,
            decision: '',
            isPickingTarget: false,
            targetAction: ''
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
                <button onClick={() => this.pickingTarget('coup')}>Coup</button>
                <button onClick={() => this.chooseAction('foreign_aid')}>Foreign Aid</button>
                <button onClick={() => this.pickingTarget('steal')}>Steal</button>
                <button onClick={() => this.pickingTarget('assassinate')}>Assassinate</button>
                <button onClick={() => this.chooseAction('tax')}>Tax</button>
                <button onClick={() => this.chooseAction('exchange')}>Exchange</button>
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
