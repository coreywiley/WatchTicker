import React, { Component } from 'react';
import ajaxWrapper from "./base/ajax.js";

import Compiler from "./compiler.js";


class ClientApp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
            pages: []
        };

        this.ajaxCallback = this.ajaxCallback.bind(this);
    }

    componentDidMount() {
        ajaxWrapper("GET", "/api/home/page/?related=pageComponents,pageComponents__component,pageComponents__component__componentProps", {}, this.ajaxCallback);
    }

    ajaxCallback(value){
        console.log(value);
        window.secretReactVars["csrfmiddlewaretoken"] = value.csrfmiddlewaretoken;
        this.setState({loaded: true, pages: value});
    }

    render() {
        console.log(this.props);

        var loading = <h1>Loading . . . </h1>;
        var content = null;
        for (var i=0; i<this.state.pages.length; i++){
            var page = this.state.pages[i].page;
            if (this.props.path == page.url){
                content = <Compiler page={page} />;
            }
        }

        return (
            <div>
                {(this.state.loaded) ? content : loading}
            </div>
        );
    }
}

export default ClientApp;
