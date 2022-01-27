import React, { Component } from 'react'
import { withTranslation } from 'react-i18next';

class RevealDecision extends Component {

    constructor(props) {
        super(props)

        const { t } = this.props;
        this.act = this.props.res.isBlock ? this.props.res.counterAction.counterAction : this.props.res.action.action
        this.actionMap = {
            tax: [t('common.influences.duke')],
            assassinate: [t('common.influences.assasin')],
            exchange: [t('common.influences.ambassador')],
            steal: [t('common.influences.captain')],
            block_foreign_aid: [t('common.influences.duke')],
            block_steal: [t('common.influences.ambassador'), t('common.influences.captain')],
            block_assassinate: [t('common.influences.contessa')],
        }
    }
    
    selectInfluence = (influence) => {
        // res.revealedCard, prevaction, counterAction, challengee, challenger, isBlock
        const res = {
            revealedCard: influence,
            prevAction: this.props.res.action,
            counterAction: this.props.res.counterAction,
            challengee: this.props.res.challengee,
            challenger: this.props.res.challenger,
            isBlock: this.props.res.isBlock
        }
        console.log(res)
        this.props.socket.emit('g-revealDecision', res);
        this.props.doneReveal();
    }

    render() {
        const { t } = this.props;
        const influences = this.props.influences.map((x, index) => {
            return <button id={x} key={index} onClick={() => this.selectInfluence(x)}>{t('common.influences.' + x)}</button>
        })
        return ( 
            <div>
                <p>{t('game.revealDecision.challenge1')} <b>{t('common.actions.' + this.act)}</b> {t('game.revealDecision.challenge2')} {t('game.revealDecision.reveal1')} {this.actionMap[this.act].join(' ' + t('game.revealDecision.or') + ' ')} {t('game.revealDecision.reveal2')} </p>
                {influences}
            </div>
        )
    }
}

export default withTranslation()(RevealDecision);
