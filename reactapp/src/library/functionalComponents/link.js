import React, { Component } from 'react';
import resolveVariables from 'base/resolver.js';

class Link extends React.Component {
    render() {
        return (
            <div className={this.props.cssClass}>
                <a href={this.props.link}>{this.props.text}</a>
                <br />
            </div>
        );
    }
}


export default Link;
