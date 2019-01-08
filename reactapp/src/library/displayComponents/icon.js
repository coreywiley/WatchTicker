import React, { Component } from 'react';
import resolveVariables from 'base/resolver.js';

class Icon extends React.Component {
    render() {
        var size = 'fa-3x';
        if (this.props.size) {
            size = 'fa-' + this.props.size + 'x';
        }

       var icon = 'fa-' + this.props.icon;

        return (
            <i style={this.props.style} className={"fa " + size + " " + icon}></i>
        );
    }
}

export default Icon;
