import React, { Component } from 'react';
import {resolveVariables} from 'functions';
import {NumberInput, Json_Input, AddChildComponent} from 'library';

class If extends Component {
    constructor(props) {
        super(props);
        this.config = {
            form_components: [
                <NumberInput label={'order'} name={'order'} />,
                <Json_Input label={'logic'} name={'logic'} />,
            ],
            can_have_children: true,
        }
    }

    render() {
      var logic = false;
      if (this.props.logic) {
        console.log("Logic", this.props.logic, window.cmState.getGlobalState(this))
        var logic_list = resolveVariables(this.props.logic, window.cmState.getGlobalState(this))
        console.log("Logic List", logic_list)
      }
      else {
        var logic_list = []
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
