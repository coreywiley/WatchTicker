import React, { Component } from 'react';
import resolveVariables from 'base/resolver.js';

class PageBreak extends React.Component {
    render() {
        return (
            <div style={{'width':'100%', 'borderBottom':'1px solid #ccc', 'margin':'0px'}}>{this.props.text}</div>
        );
    }
}

export default PageBreak;
