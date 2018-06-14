import React, { Component } from 'react';
import ajaxWrapper from "../base/ajax.js";
import Wrapper from '../base/wrapper.js';
import getComponent from '../componentResolver.js';

let ComponentDict = {
    'AutoField': "TextInput",
    'CharField': "TextInput",
    'ForeignKey': "Select",
    'IntegerField': "TextInput",
    'TextField': "TextArea"
};

class Instance extends Component {

    constructor(props) {
        super(props);
        this.state = {Components: [], ComponentProps: [], defaults: {}, loaded:false};

        this.fieldSubmitCallback = this.fieldSubmitCallback.bind(this);

    }

    componentDidMount() {
        ajaxWrapper("GET", '/api/' + this.props.app + '/' + this.props.model + '/fields/', {}, this.fieldSubmitCallback.bind(this));
    }

    fieldSubmitCallback(value) {
        var Components = [];
        var ComponentProps = [];
        var defaults = {};

        for (var index in value) {
            var auto_created = false;
            var fieldName = value[index][0];
            var fieldType = value[index][1];
            if (fieldType == 'ForeignKey') {
                auto_created = value[index][4]
            }
            if (!auto_created) {
                if (typeof(ComponentDict[fieldType]) == "undefined"){
                    console.log("FIELD TYPE NOT FOUND!!!!!!! " + fieldType);
                }
                Components.push(getComponent("name", ComponentDict[fieldType]));

                var props;
                if (fieldType == 'ForeignKey') {
                    props = {'label':fieldName, 'name':fieldName + '_id'}
                    defaults[fieldName + '_id'] = '';
                    props['optionsUrl'] = '/api/' + value[index][2] + '/' + value[index][3] + '/';
                    props['optionsUrlMap'] = {'text': [fieldName, 'unicode'], 'value':[fieldName,'id']};
                } else {
                    props = {'label':fieldName, 'name':fieldName}
                    defaults[fieldName] = '';
                }

                ComponentProps.push(props);
            }
        }
        console.log(Components, ComponentProps)
        this.setState({Components:Components, ComponentProps:ComponentProps, defaults:defaults, loaded:true})
    }

    render() {
        var Form = getComponent("name", "Form");
        
        var submitUrl = "/api/" + this.props.app + "/" + this.props.model + "/" + this.props.id + "/";
        var deleteUrl = submitUrl + "delete/";
        var content = <Form components={this.state.Components} objectName={this.props.model} dataUrl={submitUrl} componentProps={this.state.ComponentProps} submitUrl={submitUrl} deleteUrl={deleteUrl} defaults={this.state.defaults} />

        return (
            <Wrapper loaded={this.state.loaded} content={content} />
             );
    }
}
export default Instance;
