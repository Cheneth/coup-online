import React, { Component } from 'react';
import ReactModal from 'react-modal';
import { withTranslation } from 'react-i18next';

class RulesModal extends Component {

    constructor(props) {
        super(props)
    
        this.state = {
            showRulesModal: false,
        }
    }

    handleOpenRulesModal = () => {
        this.setState({ showRulesModal: true });
    }

    handleCloseRulesModal = () => {
        this.setState({ showRulesModal: false });
    }
    
    render() {
        const { t } = this.props;
        let modal = <ReactModal 
        isOpen={this.state.showRulesModal}
        contentLabel="Minimal Modal Example"
        onRequestClose={this.handleCloseRulesModal}
        shouldCloseOnOverlayClick={true}
    >
    <div className="CloseModalButtonContainer">
        <button className="CloseModalButton" onClick={this.handleCloseRulesModal}>
            <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 21 21">
                <g id="more_info" data-name="more info" transform="translate(-39 -377)">
                    <g id="Ellipse_1" data-name="Ellipse 1" class="cls-5" transform="translate(39 377)">
                    <circle class="cls-7" cx="10.5" cy="10.5" r="10.5"/>
                    <circle class="cls-8" cx="10.5" cy="10.5" r="10"/>
                    </g>
                    <text id="x" class="cls-6" transform="translate(46 391)"><tspan x="0" y="0">x</tspan></text>
                </g>
            </svg>
        </button>
    </div>
   
    <div className="RulesContainer">
        <div className="RulesContent">
            <h2>{t('rules.header')}</h2>
            <p>{t('rules.players')}</p>
            <p>{t('rules.p1')}</p>
            <p><b>{t('rules.challengeTitle')}</b>: {t('rules.challengeDescription')}</p>
            <p><b>{t('rules.blockTitle')}</b>: {t('rules.blockDescription')}</p>
            <p>{t('rules.p2')}</p>
            <p>{t('rules.p3')}</p>
            <h2>{t('rules.influencesTitle')}</h2>
            <h3>{t('common.influences.captain')}</h3>
            <p><b id="captain-color">{t('common.actions.steal')}</b>: {t('rules.captainActionDescription')} {t('rules.blockable')}<hl id="captain-color">{t('common.influences.captain')}</hl> {t('rules.or')} <hl id="ambassador-color">{t('common.influences.ambassador')}</hl>. {t('rules.blocks')}<hl id="captain-color">{t('rules.captainAction')}</hl></p>
            <h3>{t('common.influences.assassin')}</h3>
            <p><b id="assassin-color">{t('common.actions.assassinate')}</b>: {t('rules.assassinActionDescription')} {t('rules.blockable')}<hl id="contessa-color">{t('common.influences.contessa')}</hl>.</p>
            <h3>{t('common.influences.duke')}</h3>
            <p><b id="duke-color">{t('common.actions.tax')}</b>: {t('rules.dukeActionDescription')} {t('rules.notBlockable')} {t('rules.blocks')} {t('common.actions.foreignAid')}.</p>
            <h3>{t('common.influences.ambassador')}</h3>
            <p><b id="ambassador-color">{t('common.actions.exchange')}</b>: {t('rules.ambassadorActionDescription')} {t('rules.notBlockable')} {t('rules.blocks')}<hl id="captain-color">{t('common.actions.steal')}</hl></p>
            <h3>{t('common.influences.contessa')}</h3>
            <p>{t('rules.blocks')} <b id="assassin-color">{t('common.actions.assassinate')}</b>. {t('rules.notBlockable')}</p>
            <h3>{t('rules.otherActions')}</h3>
            <p><b>{t('common.actions.income')}</b>: {t('rules.incomeDescription')}</p>
            <p><b>{t('common.actions.foreignAid')}</b>: {t('rules.foreignAidDescription')} {t('rules.blockable')}<hl id="duke-color">{t('common.influences.duke')}</hl>.</p>
            <p><b>{t('common.actions.coup')}</b>: {t('rules.coupDescription')} {t('rules.notBlockable')}</p>
        </div>
    </div>
    </ReactModal>
        if(this.props.home) {
            return(
                <>
                    <div className="HomeRules" onClick={this.handleOpenRulesModal}>
                        <p>{t('rules.label')} </p>  
                        <svg className="InfoIcon"xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 21 22">
                            <g id="more_info" data-name="more info" transform="translate(-39 -377)">
                                <g id="Ellipse_1" data-name="Ellipse 1" className="cls-1" transform="translate(39 377)">
                                <circle className="cls-3" cx="10.5" cy="10.5" r="10.5"/>
                                <circle className="cls-4" cx="10.5" cy="10.5" r="10"/>
                                </g>
                                <text id="i" className="cls-2" transform="translate(48 393)"><tspan x="0" y="0">i</tspan></text>
                            </g>
                        </svg>
                    </div>
                    {modal}
                </>
            )
        }
        return (
            <>
            <div className="Rules" onClick={this.handleOpenRulesModal}>
                <p>{t('rules.label')} </p>  
                <svg className="InfoIcon"xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 21 22">
                    <g id="more_info" data-name="more info" transform="translate(-39 -377)">
                        <g id="Ellipse_1" data-name="Ellipse 1" className="cls-1" transform="translate(39 377)">
                        <circle className="cls-3" cx="10.5" cy="10.5" r="10.5"/>
                        <circle className="cls-4" cx="10.5" cy="10.5" r="10"/>
                        </g>
                        <text id="i" className="cls-2" transform="translate(48 393)"><tspan x="0" y="0">i</tspan></text>
                    </g>
                </svg>
            </div>
            {modal}
            </>
        )
    }
}

export default withTranslation()(RulesModal);
