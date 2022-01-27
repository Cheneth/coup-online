import React, { Component } from 'react'
import { Link } from "react-router-dom";
import chicken from "../assets/Chicken.svg"
import RulesModal from './RulesModal';
import { withTranslation } from 'react-i18next';

class Home extends Component {
    render() {
        const { t } = this.props;
        return (
            <>
            <div className="homeContainer">
                <h1>{t('home.welcome')}</h1>
                <p>{t('home.description')}</p>
                <img src={chicken} alt="chicken-leg"/>
                <div className="input-group-btn">
                    <Link className="home" to="/create" >{t('home.create')}</Link>
                </div>
                <div className="input-group-btn">
                    <Link className="home" to="/join" >{t('home.join')}</Link>
                </div>
                <div>
                    <div className="homeModalContainer">
                    <RulesModal home={true}/> 
                    </div>
                </div>
                

                
            </div>
            <p className="footer">{t('home.madeBy')} <a className="website-link" href="https://github.com/cheneth" target="_blank" rel="noopener noreferrer">Ethan Chen</a></p>
            <p className="version-number">Beta v0.9</p>
            </>
        )
    }
}

export default withTranslation()(Home);
