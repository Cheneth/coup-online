import React, { Component } from 'react'
import { withTranslation } from 'react-i18next';

class ChallengeDecision extends Component {

    // constructor(props) {
    //     super(props)
    // }

    vote = (isChallenging) => {
        this.props.closeOtherVotes('challenge')

        const res = {
            action: this.props.action,
            isChallenging,
            challengee: this.props.action.source,
            challenger: this.props.name
        }
        console.log(res)
        this.props.socket.emit('g-challengeDecision', res);
        this.props.doneChallengeVote();
    }

    challengeText = (action, source, target) => {
        const { t } = this.props;
        if(action === 'steal') {
            return <p><b>{source}</b> {t('game.challengeDecision.trySteal')} <b>{target}</b></p>
        }else if(action === 'tax') {
            return <p><b>{source}</b> {t('game.challengeDecision.tryTax')})</p>
        }else if(action === 'assassinate') {
            return <p><b>{source}</b> {t('game.challengeDecision.tryAssassination')} <b>{target}</b></p>
        }else if(action === 'exchange') {
            return <p><b>{source}</b> {t('game.challengeDecision.tryExchange')}</p>
        }
    }

    render() {
        const { t } = this.props;
        return (
            <>
                {this.challengeText(this.props.action.action, this.props.action.source, this.props.action.target)}
                <button onClick={() => this.vote(true)}>{t('game.challengeDecision.challenge')}</button>
                {/* <button onClick={() => this.vote(false)}>Pass</button> */}
            </>
        )
    }
}

export default withTranslation()(ChallengeDecision);
