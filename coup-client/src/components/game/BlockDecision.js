import React, { Component } from 'react'
import { withTranslation } from 'react-i18next';

class BlockDecision extends Component {

    constructor(props) {
        super(props)
    
        this.state = {
            isDecisionMade: false,
            decision: '',
            isPickingClaim: false,
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

    block = (block, claim = null) => {
        this.props.closeOtherVotes('block')
        // res.prevAction.action, res.prevAction.target, res.prevAction.source, res.counterAction, res.blockee, res.blocker, res.isBlocking
        let resClaim
        if(claim != null) {
            resClaim = claim;
        } else if(block === 'block_foreign_aid') {
            resClaim = 'duke'
        } else if(block === 'block_assassinate') {
            resClaim = 'contessa'
        } else {
            console.error('unknown claim, line 40')
        }

        const res = {
            prevAction: this.props.action,
            counterAction: {
                counterAction: block,
                claim: resClaim,
                source: this.props.name
            },
            blockee: this.props.action.source,
            blocker: this.props.name,
            isBlocking: true
        }
        console.log(res)
        this.props.socket.emit('g-blockDecision', res)
        this.props.doneBlockVote();
    }

    pass = () => {
        const res = {
            action: this.props.action,
            isBlocking: false
        }
        console.log(res)
        this.props.socket.emit('g-blockDecision', res)
        this.props.doneBlockVote();
    }

    pickClaim = (block) => {
        this.props.closeOtherVotes('block')
        this.setState({ decision: block })
        this.setState({ isPickingClaim: true })
    }

    render() {
        const { t } = this.props;
        let control = null
        let pickClaim = null
        if(!this.state.isPickingClaim) {
            if(this.props.action.action === 'foreign_aid') {
                control = <>
                <p><b>{this.props.action.source}</b> {t('game.blockDecision.foreignAid')}</p>
                <button onClick={() => this.block('block_foreign_aid')}>{t('game.blockDecision.blockForeignAid')}</button>
                </>
            } else if(this.props.action.action === 'steal') {
                control = <button onClick={() => this.pickClaim('block_steal')}>{t('game.blockDecision.blockSteal')}</button>
            } else if(this.props.action.action === 'assassinate') {
                control = <button onClick={() => this.block('block_assassinate')}>{t('game.blockDecision.blockAssassination')}</button>
            }
        } else {
            pickClaim = <>
                <p>{t('game.blockDecision.blockStealClaim')}</p>
                <button onClick={() => this.block(this.state.decision, 'ambassador')}>{t('common.influences.ambassador')}</button>
                <button onClick={() => this.block(this.state.decision, 'captain')}>{t('common.influences.captain')}</button>
            </>
        }
        
        return (
            <>
               {control}
               {pickClaim}
               {/* <button onClick={() => this.pass()}>Pass</button> */}
            </>
        )
    }
}

export default withTranslation()(BlockDecision);
