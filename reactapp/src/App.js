import React, { Component } from 'react';
import './App.css';

import ajaxWrapper from "./base/ajax.js";

import ClientApp from "./clientApp.js";

import Header from './base/header.js';
import Footer from './base/footer.js';

import Wrapper from './base/wrapper.js';
import Home from './pages/home.js';
import ComponentList from './pages/componentList.js';
import ComponentManager from './pages/componentManager.js';

import PageList from './pages/pageList.js';
import PageManager from './pages/pageManager.js';

import AppList from './pages/appList.js';
import ModelList from './pages/modelsList.js';
import InstanceList from './pages/modelInstances.js';
import Instance from './pages/instance.js';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
            csrfmiddlewaretoken: undefined
        };

        this.ajaxCallback = this.ajaxCallback.bind(this);
    }

    componentDidMount() {
        ajaxWrapper("GET", "/csrfmiddlewaretoken/", {}, this.ajaxCallback);
    }

    ajaxCallback(value){
        console.log(value);
        window.secretReactVars["csrfmiddlewaretoken"] = value.csrfmiddlewaretoken;
        this.setState({loaded: true, csrfmiddlewaretoken: value.csrfmiddlewaretoken});

    }

    getURL(){
        var url = window.location.pathname;
        if (url[0] == '/'){ url = url.substring(1);}
        if (url[url.length - 1] == '/'){ url = url.substring(0,url.length-1);}

        return url.split('/');
    }

    render() {
        console.log(this.props);
        var params = this.getURL();
        console.log("Params", params);

        var loading = <h1>Loading . . . </h1>;
        var content = null;
        if (params[0] === ""){
            //Home page
            content = <Home />

        } else if (params[0] === "components") {
            //List components
            content = <ComponentList />;
        } else if (params[0] === "component") {
            //Single component page
            content = <ComponentManager id={params[1]} />;
        } else if (params[0] === "pages") {
            //List pages
            content = <PageList />;
        } else if (params[0] === "page") {
            //Single page
            content = <PageManager id={params[1]} />;
        } else if (params[0] == "app") {
            content = <ClientApp params={params.slice(1)} />;
        }
        else if (params[0] == "appList") {
            content = <AppList />;
        }
        else if (params[0] == "models") {
            content = <ModelList app={params[1]} />
        }
        else if (params[0] == "modelInstances") {
            content = <InstanceList app={params[1]} model={params[2]} />
        }
        else if (params[0] == "instance") {
            content = <Instance app={params[1]} model={params[2]} id={params[3]} />
        }

        return (
            <div className="App">
                <Header />
                <div className="content">
                    {(this.state.loaded) ? content : loading}
                </div>
                <Footer />
            </div>
        );
    }
}

export default App;
