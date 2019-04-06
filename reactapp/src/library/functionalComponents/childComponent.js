import React, { Component } from 'react';
import resolveVariables from 'base/resolver.js';

class ChildComponent extends React.Component {
    render() {
        var child = React.cloneElement(this.props.component, this.props.newProps)

        return (child);
    }
}

export default ChildComponent;
