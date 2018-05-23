import React, { Component } from 'react';
import './App.css';

import ajaxWrapper from "./base/ajax.js";

import Header from './base/header.js';
import Footer from './base/footer.js';

import Wrapper from './base/wrapper.js';
import Home from './pages/home.js';
import ComponentList from './pages/componentList.js';
import ManageComponent from './pages/component.js';


class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
            csrf: undefined
        };

        this.ajaxCallback = this.ajaxCallback.bind(this);
    }

    componentDidMount() {
        ajaxWrapper("GET", "/api/", {}, this.ajaxCallback);
    }

    ajaxCallback(value){
        console.log(value);
        this.setState({loaded: true});
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
        console.log(params);

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
            content = <ManageComponent id={params[1]} />;
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
