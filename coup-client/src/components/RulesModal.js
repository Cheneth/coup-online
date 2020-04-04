import React, { Component } from 'react';
import ReactModal from 'react-modal';

export default class RulesModal extends Component {

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
            <h2>Rules</h2>
            <p>2-6 players</p>
            <p>On your turn, you may choose an action to play. The action you choose may or may not correspond to the influences that you possess. 
                For the action that you choose, other players may potentially block or challenge it. </p>
            <p><b>Challenge</b>: When a player declares an action they are declaring to the rest of the players that they have a certain influence, 
                and any other player can challenge it. When a player is challenged, the challenged player must reveal the correct influence 
                associated with their action. If they reveal the correct influence, the challenger player will lose an influence. However, 
                if they fail to reveal the correct influence the challenged player will lose their incorrectly revealed influence.</p>
            <p><b>Block</b>: When the any of the actions "Foreign Aid", "Steal", and "Assasinate" are used, they can be blocked. Once again, 
                any player can claim to have the correct influence to block. However, blocks can also be challenged by any player. If a block 
                fails, the original action will take place.
            </p>
            <p>
                If a player loses all their influences, they are out of the game. The last player standing wins!
            </p>
            <p>
                At this time, if a player disconnects, the game must be recreated.
            </p>
            <h2>Influences</h2>
            <h3>Captain</h3>
            <p><b id="captain-color">STEAL</b>: Steal 2 coins from a target. Blockable by <hl id="captain-color">Captain</hl> or <hl id="ambassador-color">Ambassador</hl>. Can block <hl id="captain-color">STEAL</hl></p>
            <h3>Assassin</h3>
            <p><b id="assassin-color">ASSASSINATE</b>: Pay 3 coins to choose a target to assassinate (target loses an influence). Blockable by <hl id="contessa-color">Contessa</hl>.</p>
            <h3>Duke</h3>
            <p><b id="duke-color">TAX</b>: Collect 3 coins from the treasury. Not blockable. Can block Foreign Aid.</p>
            <h3>Ambassador</h3>
            <p><b id="ambassador-color">EXCHANGE</b>: Draw 2 influences into your hand and pick any 2 influences to put back. Not blockable. Can block <hl id="captain-color">STEAL</hl></p>
            <h3>Contessa</h3>
            <p><b id="contessa-color">BLOCK ASSASSINATION</b>: Can block <b id="assassin-color">assassinations</b>. Not blockable.</p>
            <h3>Other Actions</h3>
            <p><b>INCOME</b>: Collect 1 coins from the treasury.</p>
            <p><b>FOREIGN AID</b>: Collect 2 coins from the treasury. Blockable by <hl id="duke-color">Duke</hl>.</p>
            <p><b>COUP</b>: Pay 7 coins and choose a target to lose an influence. If a player starts their turn with 10 or more coins, they must Coup. Not Blockable.</p>
        </div>
    </div>
    </ReactModal>
        if(this.props.home) {
            return(
                <>
                    <div className="HomeRules" onClick={this.handleOpenRulesModal}>
                        <p>Rules </p>  
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
                <p>Rules </p>  
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
