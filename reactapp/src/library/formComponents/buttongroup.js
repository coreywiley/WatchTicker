import React, { Component } from 'react';

class ButtonGroup extends React.Component {
    render() {
    	var type = " btn-" + this.props.type;


    	var buttons = [];
        var css = {'margin':'2px'}
    	for (var index in this.props.options) {
    	    var active = "";
    	    css = {'margin':'2px'}
    	    if (String(this.props.value) == String(this.props.options[index])) {
    	        active = " active"
    	        css = {'margin':'2px', 'background-color':'green'}
    	    }
    	        buttons.push(<label style={css} className={"btn" + active + type}>
                <input type="radio" name={this.props.name} value={this.props.options[index]} onClick={this.props.handlechange} id={this.props.options[index]} />{this.props.options[index]}
                </label>);
    	}

        return (
            <div className="btn-group btn-group-toggle" style={{'display':'block'}}>
                {buttons}
            </div>
        );
    }
}

export default ButtonGroup;
