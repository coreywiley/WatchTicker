import React, { Component } from 'react';
import {resolveVariables} from 'functions';
import {FormWithChildren, TextInput, Button} from 'library';

class CSSInput extends Component {
    constructor(props) {
        super(props);

        this.setGlobalState = this.setGlobalState.bind(this);
        this.addCSSField = this.addCSSField.bind(this);
    }

    setGlobalState(name, state) {
      var newState = {};
      for (var index in state) {
        if (index.indexOf('value_') > -1) {
          var i = index.split('_')[1]
          var name = state['name_' + i]
          newState[name] = state[index];
        }
      }

      var formState = {};
      formState[this.props.name] = newState;
      this.props.setFormState(formState)

    }

    addCSSField() {
      var value = JSON.parse(JSON.stringify(this.props.value));

      value[""] = "";

      var formState = {};
      formState[this.props.name] = value;
      this.props.setFormState(formState)
    }


    render() {

        var components = [];
        var componentProps = [];
        var defaults = {}
        var i = 0;
        for (var index in this.props.value) {
          components.push(<TextInput name={'name_' + i} layout={'col-6'} style={{width:'100%'}} />)
          defaults['name_' + i] = index;

          components.push(<TextInput name={'value_' + i} layout={'col-6'} style={{width:'100%'}} />)
          defaults['value_' + i] = this.props.value[index];
          i += 1
        }


        return (
              <div className={"form-group "}>
                {this.props.label}
                <br />
                <Button type={'primary'} text={'Add CSS Field'} onClick={this.addCSSField} />
                <br />
                <FormWithChildren layout={'form-inline'} defaults={defaults} autoSetGlobalState={true} setGlobalState={this.setGlobalState} globalStateName={'form'}>
                    {components}
                </FormWithChildren>
              </div>
        )


    }
}

export default CSSInput;
