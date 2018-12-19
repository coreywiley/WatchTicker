import React, { Component } from 'react';
import resolveVariables from 'base/resolver.js';

class Checkbox extends Component {

    render() {
        var checked = false;
        if (this.props.checked == true) {
            checked = true
        }
        //using this instead of indexOf because I was having trouble with "4" and 4.
        else if (this.props.checkList) {
            for (var index in this.props.checkList) {
                if (this.props.checkList[index] == this.props.value) {
                    checked = true;
                }
            }
        }

        return (
            <div className="custom-control custom-checkbox" style={this.props.style}>
                <input type="checkbox" className="custom-control-input" checked={checked} id={this.props.name + "-" + this.props.value}
                    name={this.props.name} onChange={this.props.onChange} value={this.props.value}/>
                <label className="custom-control-label" htmlFor={this.props.name + "-" + this.props.value}>{this.props.label}</label>
            </div>
        )
    }
}

export default Checkbox;
