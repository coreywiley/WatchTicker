import React, { Component } from 'react';
import ajaxWrapper from "./base/ajax.js";
import Compiler from "./compiler.js";
import Wrapper from "./base/wrapper.js";


class ClientApp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
            components: [],
            componentsByName: [],
            pages: []
        };
    }

    componentDidMount() {
        ajaxWrapper("GET", "/api/home/component/?related=componentProps",
            {}, this.saveComponentData.bind(this));
    }

    saveComponentData(value){
        var components = {};
        var componentsByName = {};

        for (var i in value){
            components[value[i].component.id] = value[i].component;
            componentsByName[value[i].component.name] = value[i].component;
        }

        this.setState({
            components: components,
            componentsByName: componentsByName
        });

        ajaxWrapper("GET", "/api/home/page/?related=pageComponents",
            {}, this.findCurrentPageAndContext.bind(this));
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
            for (var j=0; j<params.length; j++){
                if (params[j].startsWith("{")){
                    globalState[params[j].replace('{','').replace('}','')] = this.props.params[j];
                } else if (params[j] != this.props.params[j]) {
                    matching = false;
                }
            }
            if (matching){
                page = tempPage;
                break;
            }
        }

        this.setState({
            loaded: true,
            pages: value,
            page: page,
            globalState: globalState
        });
    }

    render() {
        console.log(this.props);

        var loading = <h1>Loading . . . </h1>;
        var content = null;
        var page = this.state.page;
        if (typeof(page) != "undefined"){
            content = <Compiler page={page} globalState={this.state.globalState}
                components={this.state.components}
                componentsByName={this.state.componentsByName} />;
        }

        return (
            <Wrapper content={content} loaded={this.state.loaded} />
        );
    }
}

export default ClientApp;
