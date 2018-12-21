import React, { Component } from 'react';
import resolveVariables from 'base/resolver.js';

class Container extends React.Component {
          render() {

                return (
                    <div className="container" style={this.props.style}>
                      {this.props.children}
                    </div>
                );
            }
}


export default Container;
