import React, { Component } from 'react';
import resolveVariables from '../base/resolver.js';

class HiddenInput extends Component {
    render() {

        return (

           <input type="hidden" name={this.props.name}value={this.props.value} />

        )


    }
}

export default HiddenInput;
