import React, { Component } from 'react'
import { Link } from "react-router-dom";
import chicken from "../assets/Chicken.svg"

export default class Home extends Component {
    render() {
        return (
            <>
            <div className="homeContainer">
                <h1>Welcome to Coup</h1>
                <p>A game of deduction and deception</p>
                <img src={chicken} alt="chicken-leg"/>
                <div className="input-group-btn">
                    <Link className="home" to="/create" >Create Game</Link>
                </div>
                <div className="input-group-btn">
                    <Link className="home" to="/join" >Join Game</Link>
                </div>
            </div>
            <p className="footer">Made by <a className="website-link" href="https://cheneth.github.io/" target="_blank" rel="noopener noreferrer">Ethan Chen</a></p>
            </>
        )
    }
}
