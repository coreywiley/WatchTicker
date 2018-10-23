import React, { Component } from 'react';
import resolveVariables from 'base/resolver.js';

class MultiLineText extends React.Component {
    render() {
        return (
            <div>
            {this.props.text.split("\n").map((i,key) => {
                return <p key={key}>{i}</p>;
            })}
            </div>
        );
    }
}

export default MultiLineText;
