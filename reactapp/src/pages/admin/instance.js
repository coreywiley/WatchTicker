import React, { Component } from 'react';
import {ajaxWrapper} from 'functions';
import {Wrapper} from 'library';
import {FormWithChildren, NumberInput, BooleanInput, TextInput, Select, TextArea, FileInput} from 'library';


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

                if (typeof(ComponentDict[fieldType]) == "undefined") {
                    console.log("FIELD TYPE NOT FOUND!!!!!!! " + fieldType);
                }

                if (ComponentDict[fieldType] == 'NumberInput') {
                    Components.push(<NumberInput {...props} />);
                }
                else if (ComponentDict[fieldType] == 'BooleanInput') {
                    Components.push(<BooleanInput {...props} />)
                }
                else if (ComponentDict[fieldType] == 'TextInput') {
                    Components.push(<TextInput {...props} />);
                }
                else if (ComponentDict[fieldType] == 'Select') {
                  Components.push(<Select {...props} />);
                }
                else if (ComponentDict[fieldType] == 'TextArea') {
                  Components.push(<TextArea {...props} />);
                }

            }
        }
        this.setState({Components:Components, defaults:defaults, loaded:true, fields:fields})
    }

    render() {
        console.log("State", this.state)
        if (this.props.id) {
          var submitUrl = "/api/" + this.props.app + "/" + this.props.model + "/" + this.props.id + "/";
          var deleteUrl = submitUrl + "delete/";
          var normForm = <FormWithChildren first={true} objectName={this.props.model} dataUrl={submitUrl} submitUrl={submitUrl} deleteUrl={deleteUrl} defaults={this.state.defaults}>
            {this.state.Components}
          </FormWithChildren>
        }
        else {
          var submitUrl = "/api/" + this.props.app + "/" + this.props.model + "/";
          var normForm = <FormWithChildren first={true} submitUrl={submitUrl} defaults={this.state.defaults}>
            {this.state.Components}
          </FormWithChildren>
        }

        var FileComponents = [FileInput]
        console.log("Submit Url",submitUrl)
        var FileProps = {'label':'Upload A CSV to batch create.', 'value':'', 'name':'csv_file', 'redirectUrl':"/modelInstances/" + this.props.app + "/" + this.props.model + "/", 'submitUrl':submitUrl}

        var content =
        <div>
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
