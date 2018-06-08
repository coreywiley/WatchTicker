import React, { Component } from 'react';

import ajaxWrapper from "../base/ajax.js";
import Wrapper from '../base/wrapper.js';
import Modal from '../library/modal.js';

import Playground from "component-playground";
import ReactDOM from "react-dom";
import Card from "../library/card.js";
import Button from "../library/button.js";
import TextInput from "../library/textinput.js";
import TextArea from "../library/textarea.js";
import Form from "../library/form.js";
import List from "../library/list.js";

class PageManager extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: true,
            activePageComponent: {'modal':false},
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

        var title = "Modal heading";

        var pageComponentComponents = [TextInput, TextInput, TextArea]
        var pageComponentComponentProps = [{'label':'Order','name':'order'}, {'label':'Data Url','name':'data_url'}, {'label':'Data','name':'data'}];
        var pageComponentSubmitUrl = "/api/home/pagecomponent/" + this.state.activePageComponent.id + "/?related=component";
        var pageComponentDeleteUrl = "/api/home/pagecomponent/" + this.state.activePageComponent.id + "/delete/";
        var pageComponentData = JSON.stringify(this.state.activePageComponent.data);
        var pageComponentDefaults = {'modal':false, 'order':this.state.activePageComponent.order, 'data_url': this.state.activePageComponent.data_url, 'data':pageComponentData, 'pagecomponent_id': this.state.activePageComponent.id}

        var content = <Form setGlobalState={this.setGlobalState} globalStateName={'activePageComponent'} title={"Page Component"} components={pageComponentComponents} componentProps={pageComponentComponentProps} submitUrl={pageComponentSubmitUrl} deleteUrl={pageComponentDeleteUrl} defaults={pageComponentDefaults}/>;

         var modal = <Modal show={this.state.activePageComponent.modal} title={title} content={content} setGlobalState={this.setGlobalState} globalStateName={'activePageComponent'} />


        var content = null;
        var data = this.state.data;


        let FormComponents = [TextInput, TextInput];
        let FormComponentProps = [{'label':'Name','name':'name'},{'label':'URL','name':'url'}]
        var submitUrl = "/api/home/page/";
        var deleteUrl = null;
        if (this.props.id) {
            submitUrl = "/api/home/page/" + this.props.id + "/";
            deleteUrl = "/api/home/page/" + this.props.id + "/delete/";
        }

        var pageForm = <Form components={FormComponents} objectName={'page'} setGlobalState={this.setGlobalState} dataUrl={submitUrl} componentProps={FormComponentProps} submitUrl={submitUrl} deleteUrl={deleteUrl} defaults={{'name':'','url':'','component':this.props.id}}/>;

        var buttonComponentProps = {'components':[], 'componentProps':[], 'submitUrl':'/api/home/pagecomponent/', 'defaults':{'modal':true,'page':this.props.id,'component':'{id}', 'order':0, 'data_url':'', 'data':''}, 'setGlobalState':this.setGlobalState, 'globalStateName':'activePageComponent', 'objectName':'pagecomponent'}
        var componentListDataMapping = {'name':'{name}', 'description':'{description}', 'buttonComponent': Form, 'buttonComponentProps':buttonComponentProps}
        var componentList = <List title={<label>Components</label>} dataUrl={'/api/home/component/'} component={Card} objectName={'component'} dataMapping={componentListDataMapping} />

        var pageComponentListDataMapping = {'name':['component','name'], 'description':'{data}', 'button':'Edit', 'button_type':'primary', 'onClick':this.setGlobalState, 'globalStateName':'activePageComponent', 'id':'{id}', 'data':'{data}','order':'{order}','data_url':'{data_url}', 'modal':true}
        var pageComponentList = <List title={<label>Existing Components</label>} dataUrl={'/api/home/pagecomponent/?page_id=' + this.props.id + '&related=component'} newComponent={this.state.newPageComponent} component={Card} objectName={'pagecomponent'} dataMapping={pageComponentListDataMapping} />


        content =
        <div className="col-sm-12">
            <h2>Manage Page</h2>
            <a href="/pages/" >back to list</a>
            <br/><br/>

            {pageForm}

            {componentList}

            {pageComponentList}

            {modal}

        </div>;

        return (
            <Wrapper loaded={this.state.loaded} content={content} />
        );
    }
}




export default PageManager;
