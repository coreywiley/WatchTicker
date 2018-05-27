import React, { Component } from 'react';

import ajaxWrapper from "../base/ajax.js";
import Wrapper from '../base/wrapper.js';
import $ from 'jquery';
import Playground from "component-playground";
import ReactDOM from "react-dom";

const componentExample =
'class App extends React.Component {\n\
    render() { \n\
        return ( \n\
            <p>Hello</p> \n\
        ); \n\
    } \n\
} \n\
ReactDOM.render(<App/>, mountNode);';

class ManageComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
            data: {name:'',description:'',html:''}
        };

        this.ajaxCallback = this.ajaxCallback.bind(this);
        this.formSubmit = this.formSubmit.bind(this);
    }

    componentDidMount() {
        if (this.props.id != 0) {
            ajaxWrapper("GET", "/api/component/" + this.props.id + "/", {}, this.ajaxCallback);
        }
        else {
            this.setState({loaded:true})
        }
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
            ajaxWrapper("POST","/models/getModelInstanceJson/home/component/" + this.props.id + "/", data, this.formSubmitCallback.bind(this));
        } else {
            ajaxWrapper("POST","/models/getModelInstanceJson/home/component/", data, this.formSubmitCallback.bind(this));
        }
    }

    formSubmitCallback (value) {
        console.log(value);
        if (this.props.id == 0){
            window.location = "/api/component/" + value[0].component.id + "/";
        }
    }

    ajaxCallback(value){

        this.setState({
            data: value.component,
            loaded: true
        });
    }

    render() {
        var content = null;
        var html = this.state.data.html;
        if (html == ""){
            html = componentExample;
        }

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
                        <div className="component-documentation">
                            <Playground codeText={html} noRender={false} scope={{React, ReactDOM}} />
                        </div>
                    <textarea className="form-control" name="html" value={data.html} onChange={this.handleChange}></textarea>
                    <br/>

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

export default ManageComponent;
