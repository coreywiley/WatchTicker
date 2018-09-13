import React, { Component } from 'react';
import resolveVariables from 'base/resolver.js';

class Header extends React.Component {
    render() {
        var css = {};
        if (this.props.css) {
          css = this.props.css;
        }

        var header = <h1 style={css}>{this.props.text}</h1>;
        if (this.props.size) {
            if (this.props.size == 2) {
                header = <h2 style={css}>{this.props.text}</h2>;
            }
            else if (this.props.size == 3) {
                header = <h3 style={css}>{this.props.text}</h3>;
            }
            else if (this.props.size == 4) {
                header = <h4 style={css}>{this.props.text}</h4>;
            }
            else if (this.props.size == 5) {
                header = <h5 style={css}>{this.props.text}</h5>;
            }
            else if (this.props.size == 6) {
                header = <h6 style={css}>{this.props.text}</h6>;
            }
        }
        return (
            <div className={this.props.layout}>{header}</div>
        );
    }
}

export default Header;
