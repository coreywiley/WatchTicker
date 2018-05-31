import React, { Component } from 'react';

import ajaxWrapper from "../base/ajax.js";
import Wrapper from '../base/wrapper.js';
import Card from '../components/card.js';
import Modal from '../components/modal.js';

import Playground from "component-playground";
import ReactDOM from "react-dom";

class PageManager extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
            data: {},
            components: [],
            pageComponents: [],
            activePageComponent: null,
            activeComponent: null,
            showComponent: false
        };

        this.ajaxCallback = this.ajaxCallback.bind(this);
        this.formSubmit = this.formSubmit.bind(this);
    }

    componentDidMount() {
        if (this.props.id > -1) {
            ajaxWrapper("GET", "/models/getModelInstanceJson/home/page/" + this.props.id + "/", {}, this.ajaxCallback);
        }
        else {
            this.setState({loaded:true});
        }
        ajaxWrapper("GET","/models/getModelInstanceJson/home/component/", {}, this.loadComponents.bind(this));
        ajaxWrapper("GET","/models/getModelInstanceJson/home/pagecomponent/?related=component&page=" + this.props.id, {}, this.loadPageComponents.bind(this));
    }

    ajaxCallback(value){
        this.setState({
            data: value[0].page,
            loaded: true
        });
    }

    loadComponents(value) {
        console.log(value);
        this.setState({components: value});
    }

    loadPageComponents(value) {
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
        var data = this.state.data;
        console.log(data);

        if (this.props.id > -1) {
            ajaxWrapper("POST","/models/getModelInstanceJson/home/page/" + this.props.id + "/", data, this.formSubmitCallback.bind(this));
        } else {
            ajaxWrapper("POST","/models/getModelInstanceJson/home/page/", data, this.formSubmitCallback.bind(this));
        }
    }

    formSubmitCallback (value) {
        console.log(value);
        if (this.props.id == -1){
            window.location = "/page/" + value[0].page.id + "/";
        }
    }

    addComponent(data){
        console.log(data);
        this.setState({
            activePageComponent: {id: -1, 'component':data.id, 'page': this.props.id},
            activeComponent: data,
            showComponent: true});
    }

    addComponentCallBack(data){
        var pageComponents = this.state.pageComponents;
        var index = -1
        for (var i=0; i<pageComponents.length; i++){
            if (pageComponents[i].pagecomponent.id == data.pagecomponent.id){
                index = i;
            }
        }
        if (index > -1){
            pageComponents.splice(index, 1);}

        pageComponents.push(data);
        this.setState({pageComponents: pageComponents});
    }

    editComponent(data){
        console.log(data);
        this.setState({
            activePageComponent: data,
            activeComponent: data['component'],
            showComponent: true});
    }

    hideComponent(){
        this.setState({showComponent: false});
    }

    render() {
        var components = [];
        for (var i = 0; i < this.state.components.length; i++){
            var data = this.state.components[i]['component'];
            var componentSmall = <Card name={data.name} description={data.description}
                onClick={this.addComponent.bind(this, data)} button='Add' button_type="primary" />;

            components.push(componentSmall);
        }
        var pageComponents = [];
        for (var i = 0; i < this.state.pageComponents.length; i++) {
            var data = this.state.pageComponents[i]['pagecomponent'];
            var name = data.order + " : " + data.component.name;
            var description = JSON.stringify(data.data);
            var componentSmall = <Card name={name} description={description} onClick={this.editComponent.bind(this, data)} button='Edit' button_type="primary" />;

            pageComponents.push(componentSmall);
        }

        var modal = null;
        if (this.state.activeComponent){
            modal = <PageComponentModal key={this.state.activePageComponent.id} component={this.state.activeComponent} data={this.state.activePageComponent}
                show={this.state.showComponent} handleClose={this.hideComponent.bind(this)} saveCallback={this.addComponentCallBack.bind(this)} />;
        }

        var content = null;
        var data = this.state.data;

        content =
        <div className="col-sm-12">
            <h2>Manage Page</h2>
            <a href="/pages/" >back to list</a>
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

            {modal}

        </div>;

        return (
            <Wrapper loaded={this.state.loaded} content={content} />
        );
    }
}



class PageComponentModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {}
        };

        this.formSubmit = this.formSubmit.bind(this);
    }

    componentDidMount() {
        var data = this.props.data;
        data.data = JSON.stringify(data.data);
        this.setState({data: this.props.data});
    }

    handleChange = (e) => {
       var name = e.target.getAttribute("name");
       var newState = {data:this.state.data}
       newState.data[name] = e.target.value;
       console.log(newState);
       this.setState(newState);
    }

    formSubmit() {
        var data = this.state.data;
        console.log(data);
        if (this.props.data.id > -1){
            ajaxWrapper("POST","/models/getModelInstanceJson/home/pagecomponent/" + this.props.data.id + "/?related=component", data, this.formSubmitCallback.bind(this));
        } else {
            ajaxWrapper("POST","/models/getModelInstanceJson/home/pagecomponent/?related=component", data, this.formSubmitCallback.bind(this));
        }
    }

    formSubmitCallback (value) {
        console.log(value);
        this.props.saveCallback(value[0]);
        this.props.handleClose();
    }

    render() {
        var content = null;
        var data = this.state.data;

        var title = "Modal heading";
        var content =
        <div className="col-sm-12">
            <h2>Page Component</h2>
            <br/><br/>

            <label>Order</label>
            <input className="form-control" name="order" value={data.order} onChange={this.handleChange} />
            <br/>

            <label>Data URL</label>
            <input className="form-control" name="data_url" value={data.data_url} onChange={this.handleChange} />
            <br/>

            <label>Data</label>
            <textarea className="form-control" name="data" value={data.data} onChange={this.handleChange} ></textarea>
            <br/>

        </div>;

        var buttons = [
            <button onClick={this.formSubmit.bind(this)} type="button" className="btn btn-success">Save changes</button>,
            <button type="button" className="btn btn-secondary" onClick={this.props.handleClose}>Close</button>
        ];

        return (
            <Modal show={this.props.show} title={title} content={content} buttons={buttons}
                onHide={this.props.handleClose} handleChange={this.handleChange.bind(this)}
                formSubmit={this.formSubmit}/>
        );
    }
}


export default PageManager;
