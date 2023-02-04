import React, { Component } from 'react'
import icons from './icons.js'

export default class ActionDecision extends Component {

    constructor(props) {
        super(props)
    
        this.state = {
            isDecisionMade: false,
            decision: '',
            isPickingTarget: false,
            targetAction: '',
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
              console.error("Assasination with less than 3 coins should be impossible.")
            }
        } else if(action === 'coup') {
            if(this.props.money >= 7) {
                this.props.deductCoins(7);
                this.pickingTarget('coup');
            } else {
              console.error("Coup with less than 7 coins should be impossible.")
            }
        }
    }

    pickingTarget = (action) => {
        this.setState({
            isPickingTarget: true,
            targetAction: action,
            actionError: ''
        });
        this.setState({targetAction: action});
    }

    pickTarget = (target) => {
        this.chooseAction(this.state.targetAction, target);
    }

    actionProps(action) {
      const ALLOWED = {
        disabled: false,
        style: {}
      }
      const NOT_ALLOWED = {
        disabled: true,
        style: {
          cursor: 'not-allowed',
          'text-decoration': 'line-through'
        }
      }

      if (action === 'assassinate' && this.props.money < 3) {
        return NOT_ALLOWED
      }
      if (action === 'coup' && this.props.money < 7) {
        return NOT_ALLOWED
      }
      if (action !== 'coup' && this.props.money >= 10) {
        return NOT_ALLOWED
      }

      return ALLOWED;
    }


    render() {
        let controls = null
        if(this.state.isPickingTarget) {
            controls = this.props.players.filter(x => !x.isDead).filter(x => x.name !== this.props.name).map((x, index) => {
                return <button style={{ backgroundColor: x.color}} key={index} onClick={() => this.pickTarget(x.name)}>{x.name}</button>
            })
        } else {
           controls = ( 
           <>   
             <button onClick={() => this.chooseAction('income')} {...this.actionProps('income')}>
               Income
               <img src={icons.Income} alt="Take 1 coin." />
             </button>
             <button onClick={() => this.chooseAction('foreign_aid')} {...this.actionProps('foreign_aid')}>
               Foreign Aid
               <img src={icons.ForeignAid} alt="Take 2 coins, can be blocked." />
             </button>
             <button onClick={() => this.deductCoins('coup')} {...this.actionProps('coup')}>
               Coup
               <img src={icons.Coup} alt="Spend 7 coins, a player loses an influence." />
             </button>
             <button id="captain" onClick={() => this.pickingTarget('steal')} {...this.actionProps('steal')}>
               Steal
               <img src={icons.Steal} alt="Take two coins from another player. " />
             </button>
             <button id="assassin" onClick={() => this.deductCoins('assassinate')} {...this.actionProps('assassinate')}>
               Assassinate
               <img src={icons.Assassinate} alt="Spend 3 coins, a player loses an influence, can be blocked." />
             </button>
             <button id="duke" onClick={() => this.chooseAction('tax')} {...this.actionProps('tax')}>
               Tax
               <img src={icons.Tax} alt="Take three coins." />
             </button>
             <button id="ambassador" onClick={() => this.chooseAction('exchange')} {...this.actionProps('exchange')}>
               Exchange
               <img src={icons.Exchange} alt="Gain two influences, then put back two influences." />
             </button>
           </> 
           )
        }
        return (<>
            <p className="DecisionTitle">Choose an action</p>
            <div className="DecisionButtonsContainer">
               {controls}
            </div>
            </>
        )
    }
}
