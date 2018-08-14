import React, { Component } from 'react';
import resolveVariables from 'base/resolver.js';

class Link extends React.Component {
    render() {
      var target = '_self';
      if (this.props.target) {
        target= this.props.target;
      }

        return (
            <div className={this.props.cssClass}>
                <a href={this.props.link} target={target}>{this.props.text}</a>
                <br />
            </div>
        );
    }
}


export default Link;
