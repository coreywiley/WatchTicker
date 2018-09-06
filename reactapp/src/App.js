import React, { Component } from 'react';
import './App.css';

import ajaxWrapper from "./base/ajax.js";

import ClientApp from "./clientApp.js";

import Header from './base/header.js';
import Footer from './base/footer.js';

import Wrapper from './base/wrapper.js';

import ComponentList from './pages/admin/componentList.js';
import ComponentManager from './pages/admin/componentManager.js';

import PageList from './pages/admin/pageList.js';
import PageManager from './pages/admin/pageManager.js';

import AppList from './pages/admin/appList.js';
import ModelList from './pages/admin/modelsList.js';
import InstanceList from './pages/admin/modelInstances.js';
import Instance from './pages/admin/instance.js';
import InstanceTable from './pages/admin/modelInstancesTable.js';

import Home from './pages/scaffold/home.js';
import LogIn from './pages/scaffold/logIn.js';
import SignUp from './pages/scaffold/signUp.js';
import LoggedIn from './pages/scaffold/loggedIn.js';
import PasswordResetRequest from './pages/scaffold/passwordResetRequest.js';
import PasswordReset from './pages/scaffold/passwordReset.js';

import CodeViewer from './pages/codeViewer.js';


class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
            csrfmiddlewaretoken: undefined,
            user:{}
        };

        this.ajaxCallback = this.ajaxCallback.bind(this);
    }

    componentDidMount() {
        ajaxWrapper("GET", "/api/csrfmiddlewaretoken/", {}, this.ajaxCallback);
        ajaxWrapper("GET", "/users/user/", {}, this.loadUser.bind(this));

        var token = localStorage.getItem('token');
        if (token) {
            this.setState({token: token});
            if (window.location.href.indexOf('login') > -1) {
                window.location.href = '/viewer/';
            }
        } else if (window.location.href.indexOf('login') == -1) {
            window.location.href = '/login/';
        }
    }

    loadUser(result){
        this.setState({
            user: result
        });
    }

    logOut() {
        console.log("Log Out")
        localStorage.removeItem('token')
        window.location.href = '/login/';
    }

    ajaxCallback(value) {
        console.log(value);
        window.secretReactVars["csrfmiddlewaretoken"] = value.csrfmiddlewaretoken;

        this.setState({
            loaded: true,
            csrfmiddlewaretoken: value.csrfmiddlewaretoken
        });
    }

    getURL() {
        var url = window.location.pathname;
        if (url[0] == '/'){ url = url.substring(1);}
        if (url[url.length - 1] == '/'){ url = url.substring(0,url.length-1);}

        return url.split('/');
    }

    render() {
        console.log(this.props);
        var params = this.getURL();
        console.log("Params", params);

        var logOut = null;
        if (this.state.token){
            logOut = this.logOut;
        }

        var loading = <h1>Loading . . . </h1>;
        var content = null;
        if (params[0] === ""){
            //Home page
            content = <Home />

        } else if (params[0].toLowerCase() === "components") {
            //List components
            content = <ComponentList />;
        } else if (params[0].toLowerCase() === "component") {
            //Single component page
            content = <ComponentManager id={params[1]} />;
        } else if (params[0].toLowerCase() === "pages") {
            //List pages
            content = <PageList />;
        } else if (params[0].toLowerCase() === "page") {
            //Single page
            content = <PageManager id={params[1]} />;
        } else if (params[0].toLowerCase() == "app") {
            content = <ClientApp params={params.slice(1)} />;
        }
        else if (params[0].toLowerCase() == "applist") {
            content = <AppList user_id={this.state.token} logOut={logOut}/>;
        }
        else if (params[0].toLowerCase() == "models") {
            content = <ModelList app={params[1]} user_id={this.state.token} logOut={logOut}/>
        }
        else if (params[0].toLowerCase() == "modelInstances") {
            content = <InstanceList app={params[1]} model={params[2]} user_id={this.state.token} logOut={logOut}/>
        }
        else if (params[0].toLowerCase() == "modelInstancesTable") {
            content = <InstanceTable app={params[1]} model={params[2]} logOut={logOut}/>
        }
        else if (params[0].toLowerCase() == "instance") {
            content = <Instance app={params[1]} model={params[2]} id={params[3]} user_id={this.state.token} logOut={logOut}/>
        }
        else if (params[0].toLowerCase() == "login") {
            content = <LogIn />
        }
        else if (params[0].toLowerCase() == "signup") {
            content = <SignUp />
        }
        else if (params[0].toLowerCase() == "loggedin") {
            content = <LoggedIn  logOut={logOut} />
        }
        else if (params[0].toLowerCase() == "passwordresetrequest") {
            content = <PasswordResetRequest />
        }
        else if (params[0].toLowerCase() == "passwordreset") {
            content = <PasswordReset  user_id={params[1]} />
        }

        else if (params[0].toLowerCase() == "viewer") {
            content = <CodeViewer user={this.state.user} />
        }


        return (
            <div className="App">
                <Wrapper token={this.state.token} navbar={true} logOut={logOut}
                    content={content} loaded={this.state.loaded} />
            </div>
        );
    }
}

export default App;
