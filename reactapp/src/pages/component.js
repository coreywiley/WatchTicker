import React, { Component } from 'react';

import ajaxWrapper from "../base/ajax.js";
import Wrapper from '../base/wrapper.js';
import $ from 'jquery';

class ManageComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
            data: undefined
        };

        this.ajaxCallback = this.ajaxCallback.bind(this);
        this.formSubmit = this.formSubmit.bind(this);
    }

    componentDidMount() {
        ajaxWrapper("GET", "/api/component/" + this.props.id + "/", {}, this.ajaxCallback);
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
        ajaxWrapper("POST","/models/modelInstance/home/component/" + this.props.id + "/", data, this.formSubmitCallback)
    }

    formSubmitCallback (value) {
        console.log(value);
    }

    ajaxCallback(value){

        this.setState({
            data: value.component,
            loaded: true
        });
    }

    render() {
        var content = null;

        if (typeof(this.state.data) != "undefined"){
            var data = this.state.data;

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

                    <label>Source</label>
                    <textarea className="form-control" name="html" value={data.html} onChange={this.handleChange}></textarea>
                    <br/>

                    <input type="submit" className="btn btn-success" name="save" value="Save" onClick={this.formSubmit} />
                    <br/><br/>

            </div>;
        }

        return (
            <Wrapper loaded={this.state.loaded} content={content} />
        );
    }
}

export default ManageComponent;
