import React, { Component } from 'react'

export default class ActionDecision extends Component {

    // constructor(props) {
    //     super(props)
    // }

    vote = (isChallenging) => {
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

    render() {
        return (
            <div>
                <p>{this.props.action.source} is trying to use {this.props.action.action} on {this.props.action.target}</p>
                <button onClick={() => this.vote(true)}>Challenge</button>
                <button onClick={() => this.vote(false)}>Pass</button>
            </div>
        )
    }
}
