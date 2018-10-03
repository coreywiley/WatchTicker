import React, { Component } from 'react';
import resolveVariables from 'base/resolver.js';

class TextInput extends Component {
    render() {

        var layout = '';
        if (this.props.layout) {
            layout = this.props.layout;
        }

        var input = <input type="text" className="form-control" name={this.props.name} onChange={this.props.handlechange} value={this.props.value} placeholder={this.props.placeholder} />;
        if (this.props.autoFocus) {
          input = <input autoFocus type="text" className="form-control" name={this.props.name} onChange={this.props.handlechange} value={this.props.value} placeholder={this.props.placeholder} />
        }

        return (
              <div className={"form-group " + this.props.layout}>
                <label>{this.props.label}</label>
                {input}
              </div>
        )


    }
}

export default TextInput;
