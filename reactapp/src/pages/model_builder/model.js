import React, { Component } from 'react';
import {ajaxWrapper} from 'functions';

import {
  FormWithChildren, TextInput, Select, PasswordInput,
  Header, TextArea, NumberInput, DateTimePicker,
  ButtonGroup, Button, Accordion, LineBreak, Alert, Wrapper
} from 'library';

import FieldInput from './fieldInput.js';
import RelatedInput from './relatedInput.js';

function pluralize(config_name) {
    var related_name = ''
    if (['s','x','z','o'].indexOf(config_name.slice(-1)) > -1 || ['sh','ch','is'].indexOf(config_name.slice(-2)) > -1) {
        related_name = config_name + 'es'
    }
    else if (config_name.slice(-1) == 'y') {
        if (['a','e','i','o','u'].indexOf(config_name.slice(-2)[0]) > -1) {
            related_name = config_name + 's'
        }
        else {
            related_name = config_name.substring(0, config_name.length - 2) + 'ies';
        }
    }
    else if (config_name.slice(-2) == 'us') {
        related_name = config_name.substring(0, config_name.length - 3) + 'i';
    }
    else if (config_name.slice(-2) == 'on') {
        related_name = config_name.substring(0, config_name.length - 3) + 'a';
    }
    else {
        related_name = config_name + 's'
    }
    return related_name;
}

class ConfigForm extends Component {
    constructor(props) {
        super(props);
        this.state = this.props.config;

        this.addField = this.addField.bind(this);
        this.removeField = this.removeField.bind(this);
        this.addRelated = this.addRelated.bind(this);

        this.updateState = this.updateState.bind(this);
        this.setGlobalState = this.setGlobalState.bind(this);

        this.save_model = this.save_model.bind(this);
        this.delete_model = this.delete_model.bind(this);
    }

    setGlobalState(type, name, state) {
        var data = this.state.data;
        var fields = data[type];
        fields[parseInt(name)] = state;
        data[type] = fields;
        this.setState({data:data})
    }

    updateState(name, state) {
        var oldState = this.state;
        oldState['name'] = state['name'];
        oldState['order'] = state['order'];
        this.setState(oldState);
    }

    addField(){
        var data = this.state.data;
        var fields = data.fields;
        if (!fields) {
            fields = [];
        }
        fields.push({'name':'', 'type':'Char', 'blank':false, 'default':'', 'max_length':1000, order: fields.length});

        data.fields = fields;

        this.setState({
            data: data,
        });
    }

    removeField(type, num) {
        var data = this.state.data;
        console.log("Data", data, type)
        data[type].splice(num, 1);

        this.setState({
            data: data,
        });
    }

    addRelated(event) {
        var data = this.state.data;
        var related = data.related;
        if (!related) {
            related = [];
        }

        var model = null;
        if (this.props.relatedNames[0]) {
            model = this.props.relatedNames[0]['value']
        }

        var related_name = '';
        if (this.state.name) {
            var config_name = this.state.name.toLowerCase();
            related_name = pluralize(config_name);
        }

        related.push({'name':'', 'model':model, 'alias': related_name});

        data.related = related;

        this.setState({
            data: data,
        });
    }

    save_model() {
        var submit_url = "/api/modelWebsite/modelconfig/";
        console.log("submit_url", submit_url, this.state)

        if (this.state.id) {
            submit_url += this.state.id + '/'
        }


        console.log("submit_url", submit_url, this.state)

        var data = this.state;
        data.data = JSON.stringify(data.data);

        ajaxWrapper("POST", submit_url, data, this.props.refreshData);
    }

    delete_model() {
        var delete_url = '/api/modelWebsite/modelconfig/' + this.state.id + '/delete/';

        ajaxWrapper('POST', delete_url, {}, this.props.refreshData)
    }

    render() {
        var config = this.state;

        var components = [];

        if (this.state.name != '') {
            var fields = this.state.data.fields || [];

            for (var j in fields) {
                var field = fields[j];
                var fieldStyle = {'marginLeft': '25px'};
                components.push(<FieldInput field={field} setGlobalState={this.setGlobalState} index={j} key={j} removeField={this.removeField} />)
                components.push(<LineBreak />);
            }

            components.push(<Button type='success' text='Add New Field' onClick={this.addField} />);

            components.push(<LineBreak />);
            components.push(<LineBreak />);

            var related = this.state.data.related || [];

            if (related.length > 0) {
                components.push(<Header text='Related Config' size={5} layout='fieldStyle' />);
            }

            for (var j in related) {
                var field = related[j];
                var fieldStyle = {'marginLeft': '25px'};
                components.push(<RelatedInput field={field} relatedNames={this.props.relatedNames} index={j} setGlobalState={this.setGlobalState} removeField={this.removeField} />)
                components.push(<LineBreak />);
            }
            components.push(<Button type='success' text='Add New Relation' onClick={this.addRelated} />);

            components.push(<LineBreak />);
            components.push(<LineBreak />);
        }

        var delete_button = null;
        if (this.state.id) {
            delete_button = <Button type='danger' text='Delete Model' deleteType={true} onClick={this.delete_model} />
        }

        return (
            <div style={{padding:'5px'}}>
                <FormWithChildren defaults={this.state} redirect={this.props.refreshData} autoSetGlobalState={true} globalStateName={'modelForm'} setGlobalState={this.updateState}>
                    <TextInput name='name' label='Name' placeholder='Name' value='' layout='col-6 inlineField' />
                    <NumberInput name='order' label='Order' placeholder='Order' value='' layout='col-6 inlineField' />
                </FormWithChildren>

                {components}

                <Button type='success' text='Save Model' onClick={this.save_model} />
                {delete_button}

                <br/>
            </div>
        );
    }
}


export default ConfigForm;
