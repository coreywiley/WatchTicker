import React, { Component } from 'react';
import resolveVariables from 'base/resolver.js';

class TextArea extends Component {
    render() {

        var layout = '';
        if (this.props.layout) {
            layout = this.props.layout;
        }

        var label = null;
        if (this.props.label && this.props.label != ''){
            label = <label>{this.props.label}</label>;
        }

        return (
              <div className={"form-group " + layout}>
                {label}
                <textarea className="form-control" name={this.props.name}
                    rows={this.props.rows}
                    onChange={this.props.handlechange}
                    onBlur={this.props.onBlur}
                    value={this.props.value}>
                </textarea>
              </div>
        )


    }
}

export default TextArea;
