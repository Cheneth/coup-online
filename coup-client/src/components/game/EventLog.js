import React, { Component } from 'react'

export default class EventLog extends Component {
    
    render() {
        return (
            <div className="EventLogContainer">
                <p className="bold EventLogTitle">Event Log</p>
                <div className="EventLogBody">
                   {this.props.logs.map((x, index) => {
                        if(index === this.props.logs.length-1){
                            return <p className="new">{x}</p>
                        }
                    return <p>{x}</p>
                    })}
                    <div style={{ float:"left", clear: "both" }}
                        ref={(el) => { this.messagesEnd = el; }}>
                    </div> 
                </div>
            </div>
        )
    }

    scrollToBottom = () => {
        this.messagesEnd.scrollIntoView({ behavior: "smooth" });
      }
      
      componentDidMount() {
        this.scrollToBottom();
      }
      
      componentDidUpdate() {
        this.scrollToBottom();
      }
}
