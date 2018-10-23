import React, { Component } from 'react';
import resolveVariables from 'base/resolver.js';

class NumberInput extends Component {
    render() {

        var layout = '';
        if (this.props.layout) {
            layout = this.props.layout;
        }

        return (
              <div className={"form-group " + this.props.layout}>
                <label>{this.props.label}</label>
                <input type="number" className="form-control" name={this.props.name}
                    onChange={this.props.handlechange} value={this.props.value}
                    placeholder={this.props.placeholder}
                    onKeyPress={this.props.handleKeyPress}
                    onBlur={this.props.onBlur}
                />
              </div>
        )


    }
}

export default NumberInput;
