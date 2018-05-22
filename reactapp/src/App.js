import React, { Component } from 'react';
import './App.css';

import ajaxWrapper from "./base/ajax.js";

import Header from './base/header.js';
import Footer from './base/footer.js';


class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
            feedback: undefined,
            csrf: undefined
        };

        this.ajaxCallback = this.ajaxCallback.bind(this);
    }

    componentDidMount() {
        ajaxWrapper("GET", "/", {}, this.ajaxCallback);
    }

    ajaxCallback(value){
        console.log(value);
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

        } else if (params[0] === "components") {
            if (params.length > 1){
                //Single component page
            } else {
                //List components
            }
        }

        return (
            <div className="App">
                <Header />

                <div class="content">
                    <div className="row col-xs-12">
                        <div className="container">
                            <div className="row col-xs-12">

                                {(this.props.loaded) ? content : loading}
                            </div>
                        </div>
                    </div>
                </div>

                <Footer />
            </div>
        );
    }
}

export default App;
