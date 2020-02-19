import React from 'react'

export default function PlayerBoard(props) {
    let boardItems = null
    if(props.players) {
        boardItems = props.players.map((player, index) =>
            <span key={index} style={{display: "inline-block"}}>
                <p>{player.name}</p>
                <p>Coins: {player.money}</p>
                {/* <p>{player.influences.join(', ')}</p> */}
            </span>
        );
    }
    return (
        <div style={{textAlign: "center"}}>
            {boardItems}
        </div>
    )
  }



