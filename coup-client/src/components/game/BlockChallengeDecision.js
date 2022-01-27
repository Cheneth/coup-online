import React, { Component } from 'react'
import { withTranslation } from 'react-i18next';

class BlockChallengeDecision extends Component {

    vote = (isChallenging) => {
        this.props.closeOtherVotes('challenge-block')

        const res = {
            counterAction: this.props.counterAction,
            prevAction: this.props.prevAction,
            isChallenging,
            challengee: this.props.counterAction.source,
            challenger: this.props.name
        }
        console.log(res)
        this.props.socket.emit('g-blockChallengeDecision', res);
        this.props.doneBlockChallengeVote();
    }

    render() {
        const { t } = this.props;
        return (
            <>
                <p>{this.props.counterAction.source} {t('game.blockChallengeDecision.tryBlock')} {t('common.actions.' + this.props.prevAction.action)} {t('game.blockChallengeDecision.from')} {this.props.prevAction.source} {t('game.blockChallengeDecision.as')} {t('common.influences.' + this.props.counterAction.claim)}</p>
                <button onClick={() => this.vote(true)}>{t('game.blockChallengeDecision.challenge')}</button>
                {/* <button onClick={() => this.vote(false)}>Pass</button> */}
            </>
        )
    }
}

export default withTranslation()(BlockChallengeDecision);
