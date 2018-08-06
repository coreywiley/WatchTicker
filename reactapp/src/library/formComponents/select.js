import React, { Component } from 'react';
import resolveVariables from 'base/resolver.js';
import ajaxWrapper from "base/ajax.js";

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
    }

    componentDidMount() {
        if (this.props.optionsUrl) {
            ajaxWrapper("GET", this.props.optionsUrl, {}, this.optionsCallback.bind(this));
        }
    }

    optionsCallback(value) {
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

    render() {
        var layout = '';
        if (this.props.layout) {
            layout = this.props.layout;
        }

        var value = this.props.value;
        if (value == '') {
            console.log('HERE!!!')
            value = this.props.defaultoption;
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

        return (
            <div className={"form-group " + this.props.layout}>
                <label>{this.props.label}</label><br />
                <select className="form-control" name={this.props.name} onChange={this.props.handlechange} value={value}>
                    {options}
                </select>
            </div>
        )
    }

}

export default Select;
