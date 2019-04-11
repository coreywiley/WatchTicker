import React, { Component } from 'react';
import {resolveVariables} from 'functions';
import {FormWithChildren, TextInput, Button, Json_Input, Select} from 'library';

class Function_Input extends Component {
    constructor(props) {
        super(props);

        this.state = {functions:[]}

        this.setGlobalState = this.setGlobalState.bind(this);
        this.addFunction = this.addFunction.bind(this);
    }

    setGlobalState(name, state) {
      var newState = {};
      var value = this.props.value;
      for (var index in state) {
        if (index.indexOf('function_') > -1) {
          var i = index.split('_')[1]
          value[i][0] = state[index];
        }
        else if (index.indexOf('value_') > -1) {
          var i = index.split('_')[1]
          value[i][1] = state[index];
        }
      }

      var formState = {};
      formState[this.props.name] = value;
      this.props.setFormState(formState)

    }

    addFunction() {
      var value = this.props.value;
      if (!value) {
        value = []
      }
      value.push(['','']);

      console.log("Here", this.props.value, value)
      var formState = {};
      formState[this.props.name] = value;
      this.props.setFormState(formState)
    }


    render() {

        var components = [];
        var componentProps = [];
        var defaults = {}
        var i = 0;
        var functions = [{'text':'ajaxWrapper',value:'ajaxWrapper'},{'text':'setState',value:'setState'},{'text':'setGlobalState',value:'setGlobalState'}]
        console.log("Render Value", this.props.value)
        for (var index in this.props.value) {
          components.push(<FormWithChildren key={i} defaults={defaults} autoSetGlobalState={true} setGlobalState={this.setGlobalState} globalStateName={'form'}>
            <Select name={'function_' + i} options={functions} default={this.props.value[index][0]} />
            <Json_Input name={'value_' + i} default={this.props.value[index][1]} />
          </FormWithChildren>)

          i += 1
        }


        return (
              <div className={"form-group"}>
                {this.props.label}
                <br />
                <Button type={'primary'} text={'Add Function'} onClick={this.addFunction} />
                <br />
                {components}
              </div>
        )


    }
}

export default Function_Input;
