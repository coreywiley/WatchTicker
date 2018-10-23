import React, { Component } from 'react';

class ButtonGroup extends React.Component {
    render() {
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
    	    var active = "";
    	    css = {}
    	    if (String(this.props.value) == String(this.props.options[index])) {
    	        active = " active"
    	        css = {}
    	    }

	        buttons.push(
                <label style={css} className={"btn" + active + type}>
                    <input type="radio" name={this.props.name} value={this.props.options[index]}
                        onClick={this.props.handlechange} id={this.props.options[index]} />{this.props.options[index]}
                </label>
            );
    	}

        return (
            <div className={layout} >
                {label}
                <div className="btn-group btn-group-toggle" style={{'display':'block'}}>
                    {buttons}
                </div>
            </div>
        );
    }
}

export default ButtonGroup;
