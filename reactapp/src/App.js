import React, { Component } from 'react';
import './App.css';
import ajaxWrapper from "./base/ajax.js";

//Component Madness
import ComponentList from './pages/admin/componentList.js';
import ComponentManager from './pages/admin/componentManager.js';
import PageList from './pages/admin/pageList.js';
import PageManager from './pages/admin/pageManager.js';

//Admin
import AppList from './pages/admin/appList.js';
import ModelList from './pages/admin/modelsList.js';
import InstanceList from './pages/admin/modelInstances.js';
import Instance from './pages/admin/instance.js';
import InstanceTable from './pages/admin/modelInstancesTable.js';

//Scaffolding
import Header from './base/header.js';
import Wrapper from './base/wrapper.js';
import Home from './pages/scaffold/home.js';
import LogIn from './pages/scaffold/logIn.js';
import SignUp from './pages/scaffold/signUp.js';
import LoggedIn from './pages/scaffold/loggedIn.js';
import PasswordResetRequest from './pages/scaffold/passwordResetRequest.js';
import PasswordReset from './pages/scaffold/passwordReset.js';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
            csrfmiddlewaretoken: undefined,
            user:{}
        };

        this.ajaxCallback = this.ajaxCallback.bind(this);
        this.getUserInfo = this.getUserInfo.bind(this);
        this.getUserInfoCallback = this.getUserInfoCallback.bind(this);
    }

    componentDidMount() {
        ajaxWrapper("GET", "/api/csrfmiddlewaretoken/", {}, this.ajaxCallback);
        ajaxWrapper("GET", "/users/user/", {}, this.loadUser.bind(this));
        var path = window.location.href.toLowerCase();

        var token = localStorage.getItem('token');
        if (token) {
            this.setState({token: token});
            if (path.indexOf('login') > -1 || window.location.pathname == "/") {
                window.location.href = '/viewer/';
            }
        } else if (path.indexOf('login') == -1 && path.indexOf('signup') == -1 &&
                    window.location.pathname != "/") {
            window.location.href = '/login/';
        }
    }

    loadUser(result){
        this.setState({
            user: result
        });
    }

    logOut() {
        console.log("Log Out");
        localStorage.removeItem('token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('token_time');
        window.location.href = '/login/';
    }

    ajaxCallback(value) {

        window.secretReactVars["csrfmiddlewaretoken"] = value.csrfmiddlewaretoken;

        this.setState({
            loaded: true,
            csrfmiddlewaretoken: value.csrfmiddlewaretoken
        });
    }

    getUserInfo() {
      console.log("Get User Info")
      ajaxWrapper('GET', '/users/user/', {}, this.getUserInfoCallback)
    }

    getUserInfoCallback(result) {
      this.setState({'user': result, loaded:true})
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

        var adminPages = ['applist','models','modelinstances','modelinstancestable','instance', 'managebusinesses']
        var loggedInPages = ['manageYourBusinesses']
        var route = params[0].toLowerCase()


        var logOut = null;
        if (this.state.token){
            logOut = this.logOut;
        }

        var loading = <h1>Loading . . . </h1>;
        var content = null;
        if (params[0] === ""){
            //Home page
            content = <Home />;

        } else if (params[0].toLowerCase() === "components") {
            //List components
            content = <ComponentList />;
        }

        if (this.state.loaded == false) {
          return (
              <div className="App">
                  <Wrapper content={<div></div>} loaded={this.state.loaded} />
              </div>
          );
        }
        else {
          return (
              <div className="App">
                  <Nav user_id={this.state.user.id} style={{'backgroundColor':'#234f9c !important'}} is_staff={this.state.user.is_staff}/>
                  <Wrapper content={content} loaded={this.state.loaded} />
                  <br />
                  <br />
                  <Footer />
            </div>
          );
        }
        else if (params[0].toLowerCase() == "applist") {
            content = <AppList user_id={this.state.token} logOut={logOut}/>;
        }
        else if (params[0].toLowerCase() == "models") {
            content = <ModelList app={params[1]} user_id={this.state.token} logOut={logOut}/>;
        }
        else if (params[0].toLowerCase() == "modelinstances") {
            content = <InstanceList app={params[1]} model={params[2]} user_id={this.state.token} logOut={logOut}/>;
        }
        else if (params[0].toLowerCase() == "modelInstancesTable") {
            content = <InstanceTable app={params[1]} model={params[2]} logOut={logOut}/>;
        }
        else if (params[0].toLowerCase() == "instance") {
            content = <Instance app={params[1]} model={params[2]} id={params[3]} user_id={this.state.token} logOut={logOut}/>;
        }
        else if (params[0].toLowerCase() == "login") {
            content = <LogIn />;
        }
        else if (params[0].toLowerCase() == "signup") {
            content = <SignUp />;
        }
        else if (params[0].toLowerCase() == "loggedin") {
            content = <LoggedIn  logOut={logOut} />;
        }
        else if (params[0].toLowerCase() == "passwordresetrequest") {
            content = <PasswordResetRequest />;
        }
        else if (params[0].toLowerCase() == "passwordreset") {
            content = <PasswordReset  user_id={params[1]} />;
        }

    }
}

export default App;
