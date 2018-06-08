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

        this.findCurrentPageAndContext = this.findCurrentPageAndContext.bind(this);
    }

    componentDidMount() {
        ajaxWrapper("GET", "/api/home/page/?related=pageComponents,pageComponents__component,pageComponents__component__componentProps",
            {}, this.findCurrentPageAndContext);
    }

    findCurrentPageAndContext(value){
        console.log(value);
        var page = undefined;
        for (var i=0; i<value.length; i++){
            var tempPage = value[i].page;
            var params = tempPage.url.split('/');
            if (params.length != this.props.params.length){
                continue;
            }

            var matching = true;
            var globalState = {};
            for (var i=0; i<params.length; i++){
                if (params[i].startsWith("{")){
                    globalState[params[i].replace('{','').replace('}','')] = this.props.params[i];
                } else if (params[i] != this.props.params[i]) {
                    matching = false;
                }
            }
            if (matching){
                page = tempPage;
            }
        }

        this.setState({loaded: true, pages: value, page: page, globalState: globalState});
    }

    render() {
        console.log(this.props);

        var loading = <h1>Loading . . . </h1>;
        var content = null;
        var page = this.state.page;
        if (typeof(page) != "undefined"){
            content = <Compiler page={page} globalState={this.state.globalState} />;
        }

        return (
            <div>
                {(this.state.loaded) ? content : loading}
            </div>
        );
    }
}

export default ClientApp;
