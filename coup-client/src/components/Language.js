import React, { Component } from 'react';
import i18n from '../i18n';
import UsFlag from '../assets/UsFlag.svg'
import EsFlag from '../assets/EsFlag.svg'

export default class Language extends Component {

    constructor(props) {
        super(props)
    
        this.state = {
            showCheatSheetModal: false,
        }
    }

    changeLanguage(lng) {
        i18n.changeLanguage(lng);
    }

    render() {
        return (
            <>
            <div className="LanguageContainer">
                <img src={UsFlag} onClick={() => this.changeLanguage('en')} alt="US Flag"/>
                <img src={EsFlag} onClick={() => this.changeLanguage('es')} alt="ES Flag"/>
            </div>
            </>
        )
    }
}
