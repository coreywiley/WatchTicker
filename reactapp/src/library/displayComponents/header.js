import React, { Component } from 'react';
import resolveVariables from 'base/resolver.js';

class Header extends React.Component {
    render() {
        var header = <h1>{this.props.text}</h1>;
        if (this.props.size) {
            if (this.props.size == 2) {
                header = <h2>{this.props.text}</h2>;
            }
            else if (this.props.size == 3) {
                header = <h3>{this.props.text}</h3>;
            }
            else if (this.props.size == 4) {
                header = <h4>{this.props.text}</h4>;
            }
            else if (this.props.size == 5) {
                header = <h5>{this.props.text}</h5>;
            }
            else if (this.props.size == 6) {
                header = <h6>{this.props.text}</h6>;
            }
        }
        return (
            <div className={this.props.layout}>{header}</div>
        );
    }
}

export default Header;