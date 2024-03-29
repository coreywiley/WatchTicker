import React, { Component } from 'react';
import {resolveVariables} from 'functions';
import {ajaxWrapper} from 'functions';
import {Button, TextInput, Json_Input, CSSInput} from 'library';


//Example
// var gender =  {'value':'','name':'gender','label':'Gender','options':[{'value':'Pick One','text':'Pick One'}, {'value':'Male', 'text':'Male'}, {'value':'Female','text':'Female'},{'value':'Other','text':"I don't identify as either"}]}

class Select extends Component {
    constructor(props) {
        super(props);
        this.state = {options:[]}

        this.config = {
            form_components: [
                <TextInput label={'name'} name={'name'} default={'Default Text'} />,
                <TextInput label={'defaultoption'} name={'defaultoption'} />,
                <TextInput label={'label'} name={'label'} />,
                <Select label={'required'} name={'required'} options={[{'text':'True', value:true}, {'text':'False', value:false}]} defaultoption={false} />,
                <Json_Input label={'options'} name={'options'} />,
                <CSSInput label={'css'} name={'style'} default={{}} />,
            ],
        }

        this.optionsCallback = this.optionsCallback.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.removeSelection = this.removeSelection.bind(this);
    }

    componentDidMount() {
        if (this.props.optionsUrl) {
          console.log("Options Url", this.props.optionsUrl);
            ajaxWrapper("GET", this.props.optionsUrl, {}, this.optionsCallback.bind(this));
        }
    }

    optionsCallback(value) {
      console.log("Options Callback", value);
        var options = [];
        for (var index in value) {
            var textValue = value[index];
            var valueValue = value[index];

            if (this.props.optionsUrlMap) {
                var resolvedValue = resolveVariables(this.props.optionsUrlMap, textValue);
                console.log("Resolved Variables", resolvedValue);
                textValue = resolvedValue['text']
                valueValue = resolvedValue['value']
            }
            options.push({'text':textValue,'value':valueValue});

        }
        console.log("Options",options);
        this.setState({options:options})
    }

    handleChange = (e) => {

      var selection = e.target.value;
      var newState = {}
      if (this.props.multiple == true) {
        var value = this.props.value;
        var index = value.indexOf(selection);
        if (index == -1) {
          value.push(selection)
        }
        newState[this.props.name] = value;
      }
      else {
        newState[this.props.name] = selection;
      }
      console.log("New State",newState);
       this.props.setFormState(newState);
    }

    removeSelection(selection) {
      var value = this.props.value;
      var index = value.indexOf(selection);
      console.log("Value", typeof value, value)
      value.splice(index,1);
      console.log("Value",value)
      var newState = {}
      newState[this.props.name] = value;
      this.props.setFormState(newState);
    }

    render() {
        var layout = '';
        if (this.props.layout) {
            layout = this.props.layout;
        }

        if (this.props.multiple == true) {
            var value = this.props.value;
            if (this.props.value) {
              if (value.length == 0) {
                value = this.props.defaultoption;
              }
            }
        }
        else {
          var value = this.props.value;
          if (value == '') {
              value = this.props.defaultoption;
          }
        }

        var optionDict = this.props.options;
        if (!(this.props.options)){
            optionDict = this.state.options;
        }

        var found_default = null;
        for (var index in optionDict) {
            if (optionDict[index]['value'] == this.props.defaultoption) {
                found_default = optionDict[index];
            }
        }

        if (found_default) {
            var options = [<option key={-1} value={found_default['value']}>{found_default['text']}</option>];
        }
        else {
            var options = [];
        }

        for (var index in optionDict) {
            if (optionDict[index]['value'] != this.props.defaultoption) {
                options.push(<option key={index} value={optionDict[index]['value']}>{optionDict[index]['text']}</option>)
            }
        }

        var multipleSelections = []

        if (this.props.multiple == true) {
          var optionsDict = {}
          for (var index in optionDict) {
            optionsDict[optionDict[index]['value']] = optionDict[index]['text']
          }
          for (var index in value) {
            multipleSelections.push(<Button key={this.props.name + '-' + index} clickHandler={() => this.removeSelection(value[index])} type={'danger'} text={optionsDict[value[index]]} />)
          }
        }

        return (
            <div className={"form-group " + this.props.className}>
                <label>{this.props.label}</label><br />
                {multipleSelections}
                <select className="form-control" name={this.props.name} onChange={this.handleChange} value={value}>
                    {options}
                </select>
            </div>
        )
    }

}

export default Select;
