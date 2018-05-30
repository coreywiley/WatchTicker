import React, { Component } from 'react';

import ajaxWrapper from "../base/ajax.js";
import Wrapper from '../base/wrapper.js';
import $ from 'jquery';
import Playground from "component-playground";
import ReactDOM from "react-dom";


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
            loaded: false,
            components: {React:React, ReactDOM:ReactDOM},
            data: {name:'',description:'',html:''},
            example: '<Header text="Hello" />',
        };

        this.ajaxCallback = this.ajaxCallback.bind(this);
        this.formSubmit = this.formSubmit.bind(this);
    }

    requireCardInRender =  async componentName => {
        var components = this.state.components;
        var component = this;
        import('../components/' + componentPaths[componentName] + '.js')
        .then(function(module) {
                components[componentName] = module.default;
                component.setState({components:components});
            }
        )
    }

    componentDidMount() {
        if (this.props.id > -1) {
            ajaxWrapper("GET", "/api/component/" + this.props.id + "/", {}, this.ajaxCallback);
        }
        else {
            this.setState({loaded:true})
        }
    }

    handleChange = (e) => {
       var name = e.target.getAttribute("name");
       if (name == 'example') {
           var newState = {example: e.target.value}
       } else {
           var newState = {data:this.state.data}
           newState.data[name] = e.target.value;
       }

       this.setState(newState);
    }

    formSubmit() {
        console.log("Data", this.state.data.name);
        var data = {name: this.state.data.name, description: this.state.data.description, html: this.state.data.html}
        console.log(data);

        if (this.props.id > -1) {
            ajaxWrapper("POST","/models/getModelInstanceJson/home/component/" + this.props.id + "/", data, this.formSubmitCallback.bind(this));
        } else {
            ajaxWrapper("POST","/models/getModelInstanceJson/home/component/", data, this.formSubmitCallback.bind(this));
        }
    }

    formSubmitCallback (value) {
        console.log(value);
        if (this.props.id == -1){
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
                    <p className='btn btn-success' onClick={() => this.requireCardInRender('Card')}>Require Card Component</p>
                    <br/>

                    <label>Name</label>
                    <input className="form-control" name="name" value={data.name} onChange={this.handleChange} />
                    <br/>

                    <label>Description</label>
                    <textarea className="form-control" name="description" value={data.description} onChange={this.handleChange}></textarea>
                    <br/>

                    <label>React</label>
                    <textarea className="form-control" name="html" value={html} onChange={this.handleChange}></textarea>
                    <br/>

                    <label>Example</label>
                    <textarea className="form-control" name="example" value={this.state.example} onChange={this.handleChange}></textarea>
                    <br/>

                    <label>Render</label>
                    <div className="component-documentation">
                        <Playground codeText={html + ' ReactDOM.render(' + this.state.example + ', mountNode);'} noRender={false} scope={this.state.components} />
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
