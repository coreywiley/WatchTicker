import React, { Component } from 'react';
import {resolveVariables} from 'functions';
import {Json_Input} from 'library';

class If extends Component {
    constructor(props) {
        super(props);
        this.config = {
            form_components: [
                <Json_Input label={'logic'} name={'logic'} />,
            ],
            can_have_children: true,
        }
    }

    render() {
      var logic = false;
      var logic_list;
      if (this.props.logic) {
        logic_list = resolveVariables(this.props.logic, window.cmState.getGlobalState(this))
      }
      else {
        logic_list = []
      }

      for (var index in logic_list) {
        var logic_check = logic_list[index][0]
        var logic_value = logic_list[index][1];
        if (logic_check == 'exists') {
          if (logic_value && logic_value != '') {
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
            if (this.props.children) {
                return (this.props.children)
            }
            else {
                return (null)
            }
        }
        else {
            return (null);
        }
    }
}

export default If;
