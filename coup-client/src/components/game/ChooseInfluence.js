import React, { Component } from 'react'
import { withTranslation } from 'react-i18next';

class ChooseInfluence extends Component {
    
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
        const { t } = this.props;
        const influences = this.props.influences.map((x, index) => {
            return <button id={`${x}`} key={index} onClick={() => this.selectInfluence(x)}>{t('common.influences.' + x)}</button>
        })
        return ( 
            <div>
                <p className="DecisionTitle">{t('game.chooseInfluence.toLose')}</p>
                {influences}
            </div>
        )
    }
}

export default withTranslation()(ChooseInfluence);
