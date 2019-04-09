import React, { Component } from 'react';
import {resolveVariables} from 'functions';

class Small extends React.Component {
    render() {
        return (
            <small>{this.props.text}</small>
        );
    }
}

export default Small;
