import React, { Component } from 'react';
import resolveVariables from 'base/resolver.js';

class Button extends React.Component {
    constructor(props) {
      super(props);
      this.click = this.click.bind(this);
    }

    click(e) {
        e.preventDefault();
        console.log("Clicked");
        if (this.props.href) {
            window.location.href = this.props.href;
        }
        else if (this.props.clickHandler) {
            this.props.clickHandler(e);
        }
    }

    render() {
    	var type = "btn-" + this.props.type;
      var css = {}
      if (this.props.css) {
        css = this.props.css;
      }
        return (
            <button className={"btn " + type} onClick={this.click} num={this.props.num} style={css}>{this.props.text}</button>
        );
    }
}

export default Button;
