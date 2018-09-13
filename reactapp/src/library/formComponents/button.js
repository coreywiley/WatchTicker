import React, { Component } from 'react';
import resolveVariables from 'base/resolver.js';

//<Button type={'success'} text={'Add New Event'} href={'/newEvent/'} />

class Button extends React.Component {
    constructor(props) {
      super(props);
      this.click = this.click.bind(this);
    }

    click() {
      console.log("Clicked");
      if (this.props.href) {
        window.location.href = this.props.href;
      }
      else if (this.props.clickHandler) {
        console.log("Click Handler")
        this.props.clickHandler();
      }
    }

    render() {
    	var type = "btn-" + this.props.type;
      var css = {}
      if (this.props.css) {
        css = this.props.css;
      }
        return (
            <button className={"btn " + type} onClick={this.click} style={css}>{this.props.text}</button>
        );
    }
}

export default Button;
