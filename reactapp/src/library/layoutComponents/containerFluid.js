import React, { Component } from 'react';
import resolveVariables from 'base/resolver.js';
import {Div} from 'library';

class ContainerFluid extends React.Component {
          render() {

                return (
                    <Div className="container-fluid" style={this.props.style}>
                      {this.props.children}
                    </Div>
                );
            }
}


export default ContainerFluid;
