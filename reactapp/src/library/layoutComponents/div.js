import React, { Component } from 'react';
import resolveVariables from 'base/resolver.js';

class Div extends React.Component {
          render() {

                return (
                    <div className={this.props.className || ''} style={this.props.style || {}}>
                      {this.props.children}
                    </div>
                );
            }
}


export default Div;
