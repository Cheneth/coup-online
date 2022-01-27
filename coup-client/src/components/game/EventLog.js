import React, { Component } from 'react'
import { withTranslation } from 'react-i18next';

class EventLog extends Component {
    
    render() {
        const { t } = this.props;
        return (
            <div className="EventLogContainer">
                <p className="bold EventLogTitle">{t('game.eventLog.eventLog')}</p>
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

export default withTranslation()(EventLog);
