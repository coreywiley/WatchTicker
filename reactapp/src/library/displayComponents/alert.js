import React, { Component } from 'react';
import {resolveVariables} from 'functions';

class Alert extends React.Component {
    render() {
      var type = 'primary';
      if (this.props.type) {
        type = this.props.type;
      }
        return (
          <div className={'alert alert-'+type} role="alert">
              {this.props.text}
          </div>
        );
    }
}

export default Alert;
