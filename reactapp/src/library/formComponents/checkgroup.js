import React, { Component } from 'react';

import {
    Checkbox
} from 'library';

class CheckGroup extends React.Component {

    handleChange (e){
        var selection = e.currentTarget.value;
        var newState = {};

        var value = [];
        if (this.props.value && typeof(this.props.value) != 'undefined'){
            value = this.props.value;
        }
        var index = value.indexOf(selection);
        if (index == -1) {
            value.push(selection);
        } else {
            value.splice(index, 1);
        }

        newState[this.props.name] = value;

        console.log("New State",newState);
        this.props.setFormState(newState);
    }

    render() {
        var value = [];
        if (this.props.value && typeof(this.props.value) != 'undefined'){
            value = this.props.value;
        }

    	var type = " btn-" + this.props.type;

        var layout = '';
        if (this.props.layout) {
            layout = 'form-group ' + this.props.layout;
        }

        var label = null;
        if (this.props.label && this.props.label != ''){
            label = <label>{this.props.label}</label>;
        }

    	var buttons = [];
        var css = {}
    	for (var index in this.props.options) {
            var checked = false;
    	    if (value.indexOf(this.props.options[index]) > -1) {
    	        checked = true;
    	    }

	        buttons.push(
                <Checkbox name={this.props.name}
                    checked={checked}
                    label={this.props.options[index]}
                    value={this.props.options[index]}
                    onChange={this.handleChange.bind(this)}
                />
            );
    	}

        return (
            <div className={layout} style={{'display':'block'}}>
                {label}
                {buttons}
            </div>
        );
    }
}

export default CheckGroup;
