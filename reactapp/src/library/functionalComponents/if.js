import React, { Component } from 'react';
import {resolveVariables} from 'functions';
import {NumberInput, TextInput, AddChildComponent} from 'library';

class If extends Component {
    constructor(props) {
        super(props);
        this.config = {
            form_components: [
                <NumberInput label={'order'} name={'order'} />,
                <TextInput label={'logic'} name={'logic'} />,
            ],
            can_have_children: true,
        }
    }

    render() {
    var logic = false;
    var logic_list = resolveVariables(this.props.logic, window.cmState.getGlobalState(this))

    for (var index in logic_list) {
      var logic_check = logic_list[index][0]
      var logic_value = logic_list[index][1];
      if (logic_check == 'exists') {
        if (logicValue && logic_value != '') {
          logic = true;
        }
      }
      else {
        if (logic_check == logic_value) {
          logic = true;
        }
      }
    }

    if (logic) {
            return (this.props.children)
        }
        else {
            return (null);
        }

    }
}

export default If;
