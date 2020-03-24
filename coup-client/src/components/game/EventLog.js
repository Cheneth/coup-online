import React, { Component } from 'react'

export default class EventLog extends Component {
    
    render() {
        return (
            <div className="EventLogContainer">
                <p className="bold">Event Log</p>
                {this.props.logs.map((x, index) => {
                    if(index === this.props.logs.length-1){
                        return <p className="new">{x}</p>
                    }
                    return <p>{x}</p>
                })}
            </div>
        )
    }
}
