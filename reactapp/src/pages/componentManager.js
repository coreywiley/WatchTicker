import React, { Component } from 'react';

import ajaxWrapper from "../base/ajax.js";
import Wrapper from '../base/wrapper.js';
import $ from 'jquery';
import Playground from "component-playground";
import ReactDOM from "react-dom";
import List from "../library/list.js";

const componentExample =
'class Header extends React.Component {\n\
    render() { \n\
        return ( \n\
            <p>{this.props.text}</p> \n\
        ); \n\
    } \n\
} \n';

let componentPaths = {'Card':'card'}


class ComponentProp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: this.props.id,
            component: this.props.component,
            name: this.props.name,
            type: this.props.type,
        };


        this.handleChange = this.handleChange.bind(this);
        this.formSubmit = this.formSubmit.bind(this);
        this.formDelete = this.formDelete.bind(this);
        this.formSubmitCallback = this.formSubmitCallback.bind(this);
    }


    handleChange = (e) => {
       var name = e.target.getAttribute("name");
       var newState = {}
       newState[name] = e.target.value;
       console.log("New State", newState)
       this.setState(newState);
    }

    formSubmit() {
        console.log("Data", this.state);

        var data = {name: this.state.name, type: this.state.type, component: this.state.component}

        if (this.props.id) {
            ajaxWrapper("POST","/api/home/componentprop/" + this.props.id + "/", data, this.formSubmitCallback.bind(this));
        } else {
            ajaxWrapper("POST","/api/home/componentprop/", data, this.formSubmitCallback.bind(this));
        }
    }

    formSubmitCallback (value) {
        console.log(value);
        this.setState({name:'Add The Prop Name', type:'Please Select A Type'});
        this.props.refreshData();
    }

    formDelete() {
        ajaxWrapper("POST","/api/home/componentprop/" + this.props.id + "/delete/", {}, this.formSubmitCallback.bind(this));
    }


    render() {

    return (
        <div className="form-row">
           <div className="form-group col-md-5">
            <label>Name: </label>
            <input type="text" className="form-control" name="name" onChange={this.handleChange} value={this.state.name} />

          </div>
          <div className="form-group col-md-5">
            <label>Type: </label>
            <select name="type" onChange={this.handleChange} value={this.state.type}>
                <option>Please Select A Type</option>
                <option>String</option>
                <option>Number</option>
                <option>List</option>
                <option>Dictionary</option>
                <option>URL</option>
                <option>Component</option>
                <option>Other</option>
            </select>

          </div>
          <button type="submit" className="btn btn-primary col-md-1" onClick={this.formSubmit}>Save</button>
          <button type="submit" className="btn btn-danger col-md-1" onClick={this.formDelete}>Delete</button>
      </div>
    )

    }
}

class ComponentRequirement extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: this.props.id,
            component: this.props.component,
            importStatement: this.props.importStatement,
        };


        this.handleChange = this.handleChange.bind(this);
        this.formSubmit = this.formSubmit.bind(this);
        this.formDelete = this.formDelete.bind(this);
        this.formSubmitCallback = this.formSubmitCallback.bind(this);
    }


    handleChange = (e) => {
       var name = e.target.getAttribute("name");
       var newState = {}
       newState[name] = e.target.value;
       console.log("New State", newState)
       this.setState(newState);
    }

    formSubmit() {
        console.log("Data", this.state);

        var data = {importStatement: this.state.importStatement, component: this.state.component}

        if (this.props.id) {
            ajaxWrapper("POST","/api/home/componentrequirement/" + this.props.id + "/", data, this.formSubmitCallback.bind(this));
        } else {
            ajaxWrapper("POST","/api/home/componentrequirement/", data, this.formSubmitCallback.bind(this));
        }
    }

    formSubmitCallback (value) {
        console.log(value);
        this.setState({importStatement:''});
        this.props.refreshData();
    }

    formDelete() {
        ajaxWrapper("POST","/api/home/componentrequirement/" + this.props.id + "/delete/", {}, this.formSubmitCallback.bind(this));
    }


    render() {

    return (
        <div className="row">
        <div className="form-row" style={{width:'100%'}}>
           <div className="form-group col-md-10">
            <label>Import Statement: </label>
            <input type="text" className="form-control" name="importStatement" onChange={this.handleChange} value={this.state.importStatement} />

          </div>
          <button type="submit" className="btn btn-primary col-md-1" onClick={this.formSubmit}>Save</button>
          <button type="submit" className="btn btn-danger col-md-1" onClick={this.formDelete}>Delete</button>
          </div>
      </div>

    )

    }
}


class ComponentManager extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
            components: {React:React, ReactDOM:ReactDOM, Component:Component},
            data: {name:'',description:'',html:'', example:''},
        };

        this.ajaxCallback = this.ajaxCallback.bind(this);
        this.formSubmit = this.formSubmit.bind(this);
    }


    componentDidMount() {
        if (this.props.id) {
            ajaxWrapper("GET", "/api/home/component/" + this.props.id + "/", {}, this.ajaxCallback);
        }
        else {
            this.setState({loaded:true})
        }
    }

    handleChange = (e) => {
       var name = e.target.getAttribute("name");
       var newState = {data:this.state.data}
       newState.data[name] = e.target.value;

       this.setState(newState);
    }

    formSubmit() {
        console.log("Data", this.state.data.name);
        var data = {name: this.state.data.name, description: this.state.data.description, html: this.state.data.html, example: this.state.data.example}
        console.log(data);

        if (this.props.id) {
            ajaxWrapper("POST","/api/home/component/" + this.props.id + "/", data, this.formSubmitCallback.bind(this));
        } else {
            ajaxWrapper("POST","/api/home/component/", data, this.formSubmitCallback.bind(this));
        }
    }

    formSubmitCallback (value) {
        console.log(value);
        if (this.props.id) {
            window.location = "/component/" + value[0].component.id + "/";
        }
    }

    ajaxCallback(value){

        this.setState({
            data: value[0].component,
            loaded: true
        });
    }

    render() {
        var content = null;
        var html = this.state.data.html;
        if (html == ""){
            html = componentExample;
        }
        var example = this.state.data.example;
        if (example == "") {
            example = '<Hello text="Hello!" />';
        }

        if (typeof(this.state.data) != "undefined"){
            var data = this.state.data;

            var lastInstanceData = {'name':'Add The Prop Name', 'type':'Please Select A Type', 'component': this.props.id};
            var extraInfo = {component:this.props.id}
            var propList = <List dataUrl={"/api/home/componentprop/?order_by=id&component=" + this.props.id} component={ComponentProp} objectName={'componentprop'} extraInfo={extraInfo} lastInstanceData={lastInstanceData} />;

            var lastInstanceData2 = {"importStatement":"import Something from '../library/something.js';", 'component': this.props.id};
            var extraInfo2= {component:this.props.id}
            var reqList = <List dataUrl={"/api/home/componentrequirement/?order_by=id&component=" + this.props.id} component={ComponentRequirement} objectName={'componentrequirement'} extraInfo={extraInfo2} lastInstanceData={lastInstanceData2} />;


            content =
            <div className="col-sm-12">
                <h2>Manage Component</h2>
                <a href="/components/" >back to list</a>
                <br/><br/>

                    <label>Name</label>
                    <input className="form-control" name="name" value={data.name} onChange={this.handleChange} />
                    <br/>

                    <label>Description</label>
                    <textarea className="form-control" name="description" value={data.description} onChange={this.handleChange}></textarea>
                    <br/>

                    <label>Requirement List</label>
                    {reqList}
                    <br/>

                    <label>React</label>
                    <textarea className="form-control" name="html" value={html} onChange={this.handleChange}></textarea>
                    <br/>

                    <label>Props</label>
                    {propList}
                    <br/>

                    <label>Example</label>
                    <textarea className="form-control" name="example" value={example} onChange={this.handleChange}></textarea>
                    <br/>

                    <label>Render</label>
                    <div className="component-documentation">
                        <Playground codeText={html + ' ReactDOM.render(' + example + ', mountNode);'} noRender={false} scope={this.state.components} />
                    </div>

                    <input type="submit" className="btn btn-success" name="save" value="Save" onClick={this.formSubmit} />
                    <br/><br/>

                  <div id='mountNode'>

                  </div>

            </div>;
        }

        return (
            <Wrapper loaded={this.state.loaded} content={content} />
        );
    }
}

export default ComponentManager;
