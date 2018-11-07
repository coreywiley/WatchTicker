import React, { Component } from 'react';

class ButtonGroup extends React.Component {
    render() {
    	var type = " btn-" + this.props.type;


    	var buttons = [];
        var css = {'margin':'2px'}
    	for (var index in this.props.options) {
    	    var active = "fa";
          var checkBoxCSS = {'border':'1px solid black','borderRadius':'4px','display':'inline-block','width':'19px','height':'19px'}
    	    css = {'margin':'2px', 'display':'block','textAlign':'left', 'margin':'0px','padding':'0px'}
    	    if (String(this.props.value) == String(this.props.options[index])) {
    	        active = "fa fa-check"
              checkBoxCSS['backgroundColor'] = '#234f9c'
              checkBoxCSS['color'] = 'white';
    	    }
	        buttons.push(<label style={css} className={"btn" + type}>
            <input type="radio" name={this.props.name} value={this.props.options[index]} onClick={this.props.handlechange} id={this.props.options[index]} /><span className={active} style={checkBoxCSS}></span> {this.props.options[index]}
            </label>);
    	}

        return (
            <div className="btn-group btn-group-toggle" style={{'display':'block', 'textAlign':'left'}}>
                <p style={{'margin':'0px'}}>{this.props.label}</p>
                <div style={{'width':'100%', 'borderTop':'1px solid #ccc'}}></div>
                {buttons}
                <br />
            </div>
        );
    }
}

export default ButtonGroup;
