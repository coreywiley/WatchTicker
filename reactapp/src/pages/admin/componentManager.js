import React, { Component } from 'react';

import {ajaxWrapper} from 'functions';
import {Wrapper} from 'library';
import $ from 'jquery';

import ReactDOM from "react-dom";
import {List, Form, Select, TextInput, TextArea, ReactRender} from "library";

const componentExample =
            'class Header extends React.Component {\n\
                render() { \n\
                    return ( \n\
                        <p>{this.props.text}</p> \n\
                    ); \n\
                } \n\
            } \n';
let componentPaths = {'Card':'card'}


class ComponentManager extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: true,
            components: {React:React, ReactDOM: ReactDOM, Component:Component},
            Form: {html:'', example:''},
        };

        this.setGlobalState = this.setGlobalState.bind(this);
    }

    setGlobalState(componentName,value) {
        console.log("Global State Change",componentName,value);
        var newState = {};
        newState[componentName] = value;
        this.setState(newState);
    }

    render() {
        var content = null;

        var data = this.state.data;

        let optionsList = [{'value':'String','text':'String'},{'value':'Number','text':'Number'},{'value':'List','text':'List'},{'value':'Dictionary','text':'Dictionary'},{'value':'URL','text':'URL'},{'value':'Component','text':'Component'},{'value':'Component List','text':'Component List'},{'value':'Function','text':'Function'},{'value':'Boolean','text':'Boolean'},{'value':'Other','text':'Other'}]

        let PropComponents = [TextInput, Select];
        let PropComponentProps = [{'layout':'col-md-5', 'label':'Name','name':'name'},
        {'layout':'col-md-5','label':'Type','name':'type','defaultoption':'Please Select A Type', 'options':optionsList}]
        var dataMapping = {'row':true, 'objectName':'componentprop', 'setGlobalState':this.setGlobalState, 'components':PropComponents, 'componentProps':PropComponentProps, 'submitUrl':"/api/home/componentprop/{id}/", 'deleteUrl':"/api/home/componentprop/{id}/delete/", 'defaults':{"name":'{name}', 'type':'{type}', 'component': this.props.id}}
        var lastInstanceData = {'row':true, 'setGlobalState':this.setGlobalState, 'components':PropComponents, 'componentProps':PropComponentProps, 'submitUrl':"/api/home/componentprop/", 'defaults':{'name':'Add The Prop Name', 'type':'Please Select A Type', 'component': this.props.id}}
        var propList = <List title={<label>Props</label>} dataUrl={"/api/home/componentprop/?order_by=id&component=" + this.props.id} component={Form} objectName={'componentprop'} dataMapping={dataMapping} lastInstanceData={lastInstanceData} />;

        let FormComponents = [TextInput];
        let FormComponentProps = [{'layout':'col-md-10', 'label':'Import Statement','name':'importStatement'}]
        dataMapping = {'objectName':'componentrequirement', 'setGlobalState':this.setGlobalState, 'importStatement': '{importStatement}', 'components':FormComponents, 'componentProps':FormComponentProps, 'submitUrl':"/api/home/componentrequirement/{id}/", 'deleteUrl':"/api/home/componentrequirement/{id}/delete/", 'defaults':{"importStatement":'{importStatement}', 'component': this.props.id}}
        lastInstanceData = {'setGlobalState':this.setGlobalState, 'components':FormComponents, 'componentProps':FormComponentProps, 'submitUrl':"/api/home/componentrequirement/", 'defaults':{"importStatement":"import Something from 'library/something.js';", 'component': this.props.id}}
        var reqList = <List title={<label>Requirement List</label>} dataUrl={"/api/home/componentrequirement/?order_by=id&component=" + this.props.id} component={Form} objectName={'componentrequirement'} dataMapping={dataMapping} lastInstanceData={lastInstanceData} />;

        let Components = [TextInput, TextArea, TextArea, TextArea];
        let ComponentProps = [{'label':'Name','name':'name'},{'label':'Description','name':'description'},{'label':'React','name':'html'},{'label':'Example','name':'example'},]

        var submitUrl = "/api/home/component/";
        var deleteUrl = null;
        if (this.props.id) {
            submitUrl = "/api/home/component/" + this.props.id + "/";
            deleteUrl = "/api/home/component/" + this.props.id + "/delete/";
        }

        var componentForm = <Form components={Components} objectName={'component'} setGlobalState={this.setGlobalState} dataUrl={"/api/home/component/" + this.props.id + "/"} componentProps={ComponentProps} submitUrl={submitUrl} redirect={this.props.refreshData} deleteUrl={deleteUrl} defaults={{'name':'','description':'','html':componentExample,'example':'<Hello text="Hello!" />', 'component':this.props.id}}/>;

        var html = "class TextInput extends React.Component { \n\
         render() {\n\
                var layout = '';\n\
                 if (this.props.layout) {\n\
                    layout = this.props.layout;\n\
                }\n\
          return (\n\
            <div className={'form-group ' + this.props.layout}>\n\
            <label>{this.props.label}</label>\n\
            <input type='text' className='form-control' name={this.props.name} onChange={this.props.handlechange} value={this.props.value} />\n\
          </div>\n\
      )\n\
  }\n\
  }";
        content =
        <div className="col-sm-12">
            <h2>Manage Component</h2>
            <a href="/components/" >back to list</a>

            {componentForm}

            {reqList}
            <br/>

            {propList}
            <br/>

            <ReactRender html={html} scope={this.state.components} example={this.state.Form.example} />

        </div>;


        return (
            <Wrapper loaded={this.state.loaded} content={content} />
        );
    }
}

export default ComponentManager;
