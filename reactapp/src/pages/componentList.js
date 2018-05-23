import React, { Component } from 'react';

import ajaxWrapper from "../base/ajax.js";
import Wrapper from '../base/wrapper.js';

class ComponentList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
            components: []
        };

        this.ajaxCallback = this.ajaxCallback.bind(this);
    }

    componentDidMount() {
        ajaxWrapper("GET", "/api/components/", {}, this.ajaxCallback);
    }

    ajaxCallback(value){
        console.log(value);

        this.setState({
            components: value.components,
            loaded: true
        });
    }

    render() {
        var content = [];
        for (var i = 0; i < this.state.components.length; i++){
            var data = this.state.components[i];
            var componentSmall =
            <div className="col-sm-4"><div className="component-small" style={{padding:"10px",margin:"10px",border:"thin #eee solid"}}>
                <h3>{data.name}</h3>
                <a href={"/component/" + data.id} className="btn btn-primary">Edit</a>
                <div>{data.description}</div>
                <br/>
            </div></div>;

            content.push(componentSmall);
        }
        var componentSmall =
        <div className="col-sm-4"><div className="component-small" style={{padding:"10px",margin:"10px",border:"thin #eee solid"}}>
            <h3>Something New?</h3>
            <a href="/component/0/" className="btn btn-success">Create New</a>
            <div></div>
            <br/>
        </div></div>;

        content.push(componentSmall);


        return (
            <Wrapper loaded={this.state.loaded} content={content} />
        );
    }
}

export default ComponentList;
