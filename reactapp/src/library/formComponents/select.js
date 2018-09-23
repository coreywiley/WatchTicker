import React, { Component } from 'react';
import resolveVariables from 'base/resolver.js';
import ajaxWrapper from "base/ajax.js";
import {Button} from 'library';

class Select extends Component {
    constructor(props) {
        super(props);
        if (this.props.options) {
            this.state = {options: this.props.options}
        }
        else {
            this.state = {options:[]}
        }

        this.optionsCallback = this.optionsCallback.bind(this);
        this.handlechange = this.handlechange.bind(this);
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
            var valueValue = value[index]

            if (this.props.optionsUrlMap) {

                for (var j in this.props.optionsUrlMap['text']) {
                    textValue = textValue[this.props.optionsUrlMap['text'][j]]
                }
                for (var k in this.props.optionsUrlMap['value']) {
                    valueValue = valueValue[this.props.optionsUrlMap['value'][k]]
                }
            }
            options.push({'text':textValue,'value':valueValue});

        }
        console.log("Options",options);
        this.setState({options:options})
    }

    handlechange = (e) => {

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

        if (this.props.defaultoption in this.state.options) {
            var options = [];
        }
        else {
            var options = [<option key={-1}>{this.props.defaultoption}</option>];
        }

        for (var index in this.state.options) {
            options.push(<option key={index} value={this.state.options[index]['value']}>{this.state.options[index]['text']}</option>)
        }

        var multipleSelections = []

        if (this.props.multiple == true) {
          var optionsDict = {}
          for (var index in this.state.options) {
            optionsDict[this.state.options[index]['value']] = this.state.options[index]['text']
          }
          for (var index in value) {
            multipleSelections.push(<Button key={this.props.name + '-' + index} clickHandler={() => this.removeSelection(value[index])} type={'danger'} text={optionsDict[value[index]]} />)
          }
        }

        return (
            <div className={"form-group " + this.props.layout}>
                <label>{this.props.label}</label><br />
                {multipleSelections}
                <select className="form-control" name={this.props.name} onChange={this.handlechange} value={value}>
                    {options}
                </select>
            </div>
        )
    }

}

export default Select;
