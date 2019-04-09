import React, { Component } from 'react';
import {resolveVariables} from 'functions';

class If extends Component {
  render() {
    if (this.props.logic) {
      return (this.props.children)
    }
    else {
      return (null);
    }

  }
}

export default If;
