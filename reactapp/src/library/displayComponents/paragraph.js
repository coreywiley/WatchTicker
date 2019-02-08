import React, { Component } from 'react';
import resolveVariables from 'base/resolver.js';

class Paragraph extends React.Component {
    render() {
        return (
            <p style={this.props.style || {}}>{this.props.text}</p>
        );
    }
}

export default Paragraph;
