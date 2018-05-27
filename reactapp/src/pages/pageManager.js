import React, { Component } from 'react';

import ajaxWrapper from "../base/ajax.js";
import Wrapper from '../base/wrapper.js';
import Card from '../components/card.js';

import Playground from "component-playground";
import ReactDOM from "react-dom";

class PageManager extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
            data: {},
            components: [],
            pageComponents: []
        };

        this.ajaxCallback = this.ajaxCallback.bind(this);
        this.formSubmit = this.formSubmit.bind(this);
    }

    componentDidMount() {
        if (this.props.id != 0) {
            ajaxWrapper("GET", "/models/getModelInstanceJson/home/page/" + this.props.id + "/", {}, this.ajaxCallback);
        }
        else {
            this.setState({loaded:true});
        }
        ajaxWrapper("GET","/models/getModelInstanceJson/home/component/", {}, this.loadComponents.bind(this));
        ajaxWrapper("GET","/models/getModelInstanceJson/home/pagecomponent/", {}, this.loadPageComponents.bind(this));
    }

    loadComponents(value) {
        console.log(value);
        this.setState({components: value});
    }

    loadPageComponents(value){
        this.setState({pageComponents: value});
    }

    handleChange = (e) => {
       var name = e.target.getAttribute("name");
       var newState = {data:this.state.data}
       newState.data[name] = e.target.value;
       console.log(newState);
       this.setState(newState);
    }

    formSubmit() {
        console.log("Data", this.state.data.name);
        var data = {name: this.state.data.name, description: this.state.data.description, html: this.state.data.html}
        console.log(data);

        if (this.props.id != 0) {
            ajaxWrapper("POST","/models/getModelInstanceJson/home/page/" + this.props.id + "/", data, this.formSubmitCallback.bind(this));
        } else {
            ajaxWrapper("POST","/models/getModelInstanceJson/home/page/", data, this.formSubmitCallback.bind(this));
        }
    }

    formSubmitCallback (value) {
        console.log(value);
        if (this.props.id == 0){
            window.location = "/page/" + value[0].page.id + "/";
        }
    }

    ajaxCallback(value){
        this.setState({
            data: value[0].page,
            loaded: true
        });
    }

    render() {
        var components = [];
        for (var i = 0; i < this.state.components.length; i++){
            var data = this.state.components[i]['component'];
            var componentSmall = <Card name={data.name} description={data.description} button='Add' button_type="primary" />;

            components.push(componentSmall);
        }
        var pageComponents = [];
        for (var i = 0; i < this.state.pageComponents.length; i++){
            var data = this.state.pageComponents[i];
            var componentSmall = <Card name={data.name} description={data.description} button='Edit' button_type="primary" />;

            pageComponents.push(componentSmall);
        }

        var content = null;
        var data = this.state.data;

        content =
        <div className="col-sm-12">
            <h2>Manage Page</h2>
            <a href="/components/" >back to list</a>
            <br/><br/>

            <label>Name</label>
            <input className="form-control" name="name" value={data.name} onChange={this.handleChange} />
            <br/>

            <label>URL</label>
            <input className="form-control" name="url" value={data.url} onChange={this.handleChange} />
            <br/>

            <label>Components</label>
            <div className="row col-sm-12">
                {components}
            </div>
            <div>Existing Components</div>
            <div className="row col-sm-12">
                {pageComponents}
            </div>
            <div>

            </div>
            <br/>

            <input type="submit" className="btn btn-success" name="save" value="Save" onClick={this.formSubmit} />
            <br/><br/>

        </div>;

        return (
            <Wrapper loaded={this.state.loaded} content={content} />
        );
    }
}

export default PageManager;
