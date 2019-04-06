import React, { Component } from 'react';
import resolveVariables from 'base/resolver.js';

class Break extends React.Component {
          render() {

                return (
                    <br style={this.props.style || {}} />
                );
            }
}


export default Break;
