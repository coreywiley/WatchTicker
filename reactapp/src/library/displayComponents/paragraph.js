import React, { Component } from 'react';
import resolveVariables from '../base/resolver.js';

class Paragraph extends React.Component {
    render() {
        return (
            <p>{this.props.text}</p>
        );
    }
}

export default Paragraph;
