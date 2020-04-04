import React, { Component } from 'react'

export default class ChallengeDecision extends Component {

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
        if(action === 'steal') {
            return <p><b>{source}</b> is trying to Steal from <b>{target}</b></p>
        }else if(action === 'tax') {
            return <p><b>{source}</b> is trying to collect Tax (3 coins)</p>
        }else if(action === 'assassinate') {
            return <p><b>{source}</b> is trying to Assassinate <b>{target}</b></p>
        }else if(action === 'exchange') {
            return <p><b>{source}</b> is trying to Exchange their influences</p>
        }
    }

    render() {
        return (
            <>
                {this.challengeText(this.props.action.action, this.props.action.source, this.props.action.target)}
                <button onClick={() => this.vote(true)}>Challenge</button>
                {/* <button onClick={() => this.vote(false)}>Pass</button> */}
            </>
        )
    }
}
