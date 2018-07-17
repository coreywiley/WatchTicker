import React, { Component } from 'react';
import resolveVariables from '../base/resolver.js';

class Header2 extends React.Component {
    render() {
    	return (
            <h2>{this.props.text}</h2>
        );
    }
}

export default Header2;
