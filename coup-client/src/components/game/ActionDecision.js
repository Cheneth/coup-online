import React, { Component } from 'react'
import { withTranslation } from 'react-i18next';

class ActionDecision extends Component {

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
        const { t } = this.props;
        console.log(this.props.money, action)
        if(action === 'assassinate') {
            if(this.props.money >= 3) {
                this.props.deductCoins(3);
                this.pickingTarget('assassinate');
            } else {
                this.setState({ actionError: t('game.actionDecision.assasionationCoins')})
            }
        } else if(action === 'coup') {
            if(this.props.money >= 7) {
                this.props.deductCoins(7);
                this.pickingTarget('coup');
            } else {
                this.setState({ actionError: t('game.actionDecision.coupCoins')})
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

    render() {
        const { t } = this.props;
        let controls = null
        if(this.state.isPickingTarget) {
            controls = this.props.players.filter(x => !x.isDead).filter(x => x.name !== this.props.name).map((x, index) => {
                return <button style={{ backgroundColor: x.color}} key={index} onClick={() => this.pickTarget(x.name)}>{x.name}</button>
            })
        } else if(this.props.money < 10) {
           controls = ( 
           <>   
                <button onClick={() => this.chooseAction('income')}>{t('game.actionDecision.income')}</button>
                <button onClick={() => this.deductCoins('coup')}>{t('game.actionDecision.coup')}</button>
                <button onClick={() => this.chooseAction('foreign_aid')}>{t('game.actionDecision.foreignAid')}</button>
                <button id="captain" onClick={() => this.pickingTarget('steal')}>{t('game.actionDecision.steal')}</button>
                <button id="assassin" onClick={() => this.deductCoins('assassinate')}>{t('game.actionDecision.assassinate')}</button>
                <button id="duke" onClick={() => this.chooseAction('tax')}>{t('game.actionDecision.tax')}</button>
                <button id="ambassador" onClick={() => this.chooseAction('exchange')}>{t('game.actionDecision.exchange')}</button>
           </> 
           )
        } else { //money over 10, has to coup
            controls = <button onClick={() => this.deductCoins('coup')}>Coup</button>
        }
        return (<>
            <p className="DecisionTitle">{t('game.actionDecision.choose')}</p>
            <div className="DecisionButtonsContainer">
               {controls}
               <p>{this.state.actionError}</p>
            </div>
            </>
        )
    }
}

export default withTranslation()(ActionDecision);
