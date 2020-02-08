import React, { Component } from 'react'
import { Link } from "react-router-dom";

export default class Home extends Component {
    render() {
        return (
            <div>
                <div className="input-group-btn">
                    <Link to="/create" >Create Game</Link>
                </div>
                <div className="input-group-btn">
                    <Link to="/join" >Join Game</Link>
                </div>
            </div>
        )
    }
}
