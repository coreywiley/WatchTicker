import React, { Component } from 'react';
import {resolveVariables} from 'functions';

class Paragraph extends React.Component {
    render() {
        return (
            <p style={this.props.style || {}}>{this.props.text}</p>
        );
    }
}

export default Paragraph;
