import React, { Component } from 'react';
import resolveVariables from 'base/resolver.js';

class ContainerFluid extends React.Component {
          render() {

                return (
                    <div className="container-fluid" style={this.props.style}>
                      {this.props.children}
                    </div>
                );
            }
}


export default ContainerFluid;
