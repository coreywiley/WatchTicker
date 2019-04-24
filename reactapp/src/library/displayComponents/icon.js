import React, { Component } from 'react';
import {resolveVariables} from 'functions';

class Icon extends React.Component {
    render() {
        var size = 'fa-3x';
        if (this.props.size) {
            size = 'fa-' + this.props.size + 'x';
        }

       var icon = 'fa-' + this.props.icon;

       var type = this.props.type || 'fas';
       if (this.props.list_icon) {
           type += ' fa-li'
       }

        return (
            <i style={this.props.style} className={type + " " + size + " " + icon}></i>
        );
    }
}

export default Icon;
