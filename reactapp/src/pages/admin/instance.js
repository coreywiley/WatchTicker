import React, { Component } from 'react';
import ajaxWrapper from "base/ajax.js";
import Wrapper from 'base/wrapper.js';
import getComponent from '../../componentResolver.js';
import {Form, NumberInput, BooleanInput, TextInput, Select, TextArea, FileInput} from 'library';
import Nav from 'projectLibrary/nav.js';

let ComponentDict = {
    'AutoField': "TextInput",
    'CharField': "TextInput",
    'ForeignKey': "Select",
    'IntegerField': "TextInput",
    'TextField': "TextArea",
    'DecimalField':'NumberInput',
    'BooleanField':'BooleanInput',
    'ManyToManyField':'Select',
    'DateTimeField': 'TextInput',
};

class Instance extends Component {

    constructor(props) {
        super(props);
        this.state = {Components: [], ComponentProps: [], defaults: {}, loaded:false, fields:[]};

        this.fieldSubmitCallback = this.fieldSubmitCallback.bind(this);
        this.defaultHandler = this.defaultHandler.bind(this);

    }

    componentDidMount() {
        ajaxWrapper("GET", '/api/' + this.props.app + '/' + this.props.model + '/fields/', {}, this.fieldSubmitCallback.bind(this));
    }

    defaultHandler(value) {
        var defaultName = Object.keys(value)[0];
        var defaults = this.state.defaults;
        defaults[defaultName + 's[]'] = value[defaultName]
        this.setState({defaults:defaults})
    }

    fieldSubmitCallback(value) {
        var Components = [];
        var ComponentProps = [];
        var defaults = {};
        var fields = value;
        for (var index in value) {
            var auto_created = false;
            var fieldName = value[index][0];
            if (fieldName == 'id') {
              continue;
            }
            var fieldType = value[index][1];
            if (fieldType == 'ForeignKey') {
                auto_created = value[index][4]
            }
            if (fieldType == 'ManyToManyField') {
                auto_created = value[index][4]
            }
            if (!auto_created) {
                if (typeof(ComponentDict[fieldType]) == "undefined") {
                    console.log("FIELD TYPE NOT FOUND!!!!!!! " + fieldType);
                }

                if (ComponentDict[fieldType] == 'NumberInput') {
                    Components.push(NumberInput);
                }
                else if (ComponentDict[fieldType] == 'BooleanInput') {
                    Components.push(BooleanInput)
                }
                else if (ComponentDict[fieldType] == 'TextInput') {
                    Components.push(TextInput);
                }
                else if (ComponentDict[fieldType] == 'Select') {
                  Components.push(Select);
                }
                else if (ComponentDict[fieldType] == 'TextArea') {
                  Components.push(TextArea);
                }


                var props;
                if (fieldType == 'ForeignKey') {
                    props = {'label':fieldName, 'name':fieldName}
                    defaults[fieldName] = '';
                    props['optionsUrl'] = '/api/' + value[index][2] + '/' + value[index][3] + '/';
                    props['optionsUrlMap'] = {'text': [fieldName, 'unicode'], 'value':[fieldName,'id']};
                }
                else if (fieldType == 'ManyToManyField') {
                    props = {'label':fieldName, 'name':fieldName + '[]'}
                    defaults[fieldName + '[]'] = [];
                    props['optionsUrl'] = '/api/' + value[index][2] + '/' + value[index][3] + '/';
                    props['optionsUrlMap'] = {'text': [value[index][3], 'unicode'], 'value':[value[index][3],'id']};
                    props['multiple'] = true;
                    ajaxWrapper('GET','/api/' + value[index][2] + '/' + value[index][3] + '/?values_list=id&' + this.props.model.toLowerCase() + 's=' + this.props.id,{},this.defaultHandler)
                }
                else if (fieldType == 'BooleanField') {
                  props = {'label':fieldName, 'name':fieldName}
                  defaults[fieldName] = 'false';
                }
                else {
                    props = {'label':fieldName, 'name':fieldName}
                    defaults[fieldName] = '';
                }

                ComponentProps.push(props);
            }
        }
        console.log(Components, ComponentProps)
        this.setState({Components:Components, ComponentProps:ComponentProps, defaults:defaults, loaded:true, fields:fields})
    }

    render() {
        console.log("State", this.state)
        if (this.props.id) {
          var submitUrl = "/api/" + this.props.app + "/" + this.props.model + "/" + this.props.id + "/";
          var deleteUrl = submitUrl + "delete/";
          var normForm = <Form components={this.state.Components} first={true} objectName={this.props.model} dataUrl={submitUrl} componentProps={this.state.ComponentProps} submitUrl={submitUrl} deleteUrl={deleteUrl} defaults={this.state.defaults} />
        }
        else {
          var submitUrl = "/api/" + this.props.app + "/" + this.props.model + "/";
          var normForm = <Form components={this.state.Components} first={true} componentProps={this.state.ComponentProps} submitUrl={submitUrl} defaults={this.state.defaults} />
        }

        var FileComponents = [FileInput]
        console.log("Submit Url",submitUrl)
        var FileProps = {'label':'Upload A CSV to batch create.', 'value':'', 'name':'csv_file', 'redirectUrl':"/modelInstances/" + this.props.app + "/" + this.props.model + "/", 'submitUrl':submitUrl}

        var content =
        <div>
          <Nav token={this.props.user_id} logOut={this.props.logOut} />
          {normForm}
          <FileInput {...FileProps} />
        </div>

        return (
            <div className="container">
                <Wrapper loaded={this.state.loaded} content={content} />
            </div>
             );
    }
}
export default Instance;