import React, { Component } from 'react';
import {resolveVariables} from 'functions';
import {Div} from 'library';

class Container extends React.Component {
          render() {

                return (
                    <Div className="container" style={this.props.style}>
                      {this.props.children}
                    </Div>
                );
            }
}


export default Container;
