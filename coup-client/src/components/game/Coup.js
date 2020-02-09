import React, { Component } from 'react'

export default class Coup extends Component {

    constructor(props) {
        super(props)
    
        this.state = {
             
        }
    }
    

    render() {
        return (
            <div>
                <p>{this.props.name}</p>
            </div>
        )
    }
}
