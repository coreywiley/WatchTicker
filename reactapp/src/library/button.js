import React, { Component } from 'react';
import resolveVariables from '../base/resolver.js';

class Button extends React.Component {
    render() {
    	var type = "btn-" + this.props.type;
        return (
            <div className={"btn " + type} >{this.props.text}</div>
        );
    }
}

export default Button;
