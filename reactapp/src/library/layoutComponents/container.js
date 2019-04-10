import React, { Component } from 'react';
import {resolveVariables} from 'functions';
import {Div} from 'library';

class Container extends React.Component {
          render() {

                var className = "container ";
                if (this.props.className) {
                  className += this.props.className;
                }

                return (
                    <Div className={className} style={this.props.style}>
                      {this.props.children}
                    </Div>
                );
            }
}


export default Container;
