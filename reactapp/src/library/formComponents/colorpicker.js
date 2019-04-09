import React, { Component } from 'react';
import {resolveVariables} from 'functions';
import {ChromePicker} from 'react-color';

class ColorPicker extends Component {
    constructor(props) {
      super(props)

      this.setFormState = this.setFormState.bind(this);
    }

    setFormState(color, event) {
      var newState = {};
      newState[this.props.name] = color.hex;
      this.props.setFormState(newState);
    }

    render() {

        return (
            <div style={{padding:'20px'}}>
              <ChromePicker {...this.props} color={this.props.value} onChange={this.setFormState} />
            </div>
        )
    }
}

export default ColorPicker;
