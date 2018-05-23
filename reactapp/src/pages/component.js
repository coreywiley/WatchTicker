import React, { Component } from 'react';

import ajaxWrapper from "../base/ajax.js";
import Wrapper from '../base/wrapper.js';

class ManageComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
            data: undefined
        };

        this.ajaxCallback = this.ajaxCallback.bind(this);
    }

    componentDidMount() {
        ajaxWrapper("GET", "/api/component/" + this.props.id + "/", {}, this.ajaxCallback);
    }

    ajaxCallback(value){
        console.log(value);

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

                <form action="POST" >
                    <label>Name</label>
                    <input className="form-control" name="name" value={data.name} />
                    <br/>

                    <label>Description</label>
                    <textarea className="form-control" name="description">{data.description}</textarea>
                    <br/>

                    <label>Source</label>
                    <textarea className="form-control" name="html">{data.html}</textarea>
                    <br/>

                    <input className="btn btn-success" name="save" value="Save" />
                    <br/><br/>
                </form>
            </div>;
        }

        return (
            <Wrapper loaded={this.state.loaded} content={content} />
        );
    }
}

export default ManageComponent;
