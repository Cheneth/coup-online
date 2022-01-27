import React from 'react'
import { withTranslation } from 'react-i18next';
import './PlayerBoardStyles.css'

function PlayerBoard(props) {
    const { t } = props;
    let boardItems = null
    if(props.players.length > 1) {
        boardItems = props.players.map((player, index) =>
            <span className="PlayerBoardItem" style={{ backgroundColor: `${player.color}` }} key={index}>
                <h2>{player.name}</h2>
                <p>{t('game.playerBoard.coins')}: {player.money}</p>
                <p>{t('game.playerBoard.influences')}: {player.influences.length}</p>
                {/* <p>{player.influences.join(', ')}</p> */}
            </span>
        );
    }
    return (
        <div className="PlayerBoardContainer" style={{textAlign: "center"}}>
            {boardItems}
        </div>
    )
  }

export default withTranslation()(PlayerBoard);
