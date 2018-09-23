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
import Footer from './base/footer.js';
import Wrapper from './base/wrapper.js';
import Home from './pages/scaffold/home.js';
import LogIn from './pages/scaffold/logIn.js';
import SignUp from './pages/scaffold/signUp.js';
import LoggedIn from './pages/scaffold/loggedIn.js';
import PasswordResetRequest from './pages/scaffold/passwordResetRequest.js';
import PasswordReset from './pages/scaffold/passwordReset.js';

import FormPage from './pages/form.js';


class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: true,
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
        window.location.href = '/login/';
    }

    ajaxCallback(value) {

        window.secretReactVars["csrfmiddlewaretoken"] = value.csrfmiddlewaretoken;
        var token = localStorage.getItem('token')
        if (token) {
            if (window.location.href.indexOf('login') > -1 || window.location.href.indexOf('signup') > -1) {
                window.location.href = '/';
            }
            else {
                this.setState({csrfmiddlewaretoken: value.csrfmiddlewaretoken, token: token}, this.getUserInfo);
            }
        }
        else {
          this.setState({loaded:true,csrfmiddlewaretoken: value.csrfmiddlewaretoken})
        }

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

        var loading = <h1>Loading . . . </h1>;
        var content = null;
        if (params[0] === ""){
            //Home page
            content = <Home />
        } else if (params[0].toLowerCase() === "components") {
            //List components
            content = <ComponentList />;
        }
        else if (params[0].toLowerCase() === "logout") {
            this.logOut();
        }
        else if (params[0].toLowerCase() === "component") {
            //Single component page
            content = <ComponentManager id={params[1]} />;
        } else if (params[0].toLowerCase() === "pages") {
            //List pages
            content = <PageList />;
        } else if (params[0].toLowerCase() === "page") {
            //Single page
            content = <PageManager id={params[1]} />;
        }
        else if (params[0].toLowerCase() == "applist") {
            content = <AppList user_id={this.state.token} logOut={this.logOut}/>;
        }
        else if (params[0].toLowerCase() == "models") {
            content = <ModelList app={params[1]} user_id={this.state.token} logOut={this.logOut}/>
        }
        else if (params[0].toLowerCase() == "modelinstances") {
            content = <InstanceList app={params[1]} model={params[2]} user_id={this.state.token} logOut={this.logOut}/>
        }
        else if (params[0].toLowerCase() == "modelInstancesTable") {
            content = <InstanceTable app={params[1]} model={params[2]} logOut={this.logOut}/>
        }
        else if (params[0].toLowerCase() == "instance") {
            content = <Instance app={params[1]} model={params[2]} id={params[3]} user_id={this.state.token} logOut={this.logOut}/>
        }
        else if (params[0].toLowerCase() == "login") {
            content = <LogIn />
        }
        else if (params[0].toLowerCase() == "signup") {
            content = <SignUp />
        }
        else if (params[0].toLowerCase() == "loggedin") {
            content = <LoggedIn  logOut={this.logOut} />
        }
        else if (params[0].toLowerCase() == "passwordresetrequest") {
            content = <PasswordResetRequest />
        }
        else if (params[0].toLowerCase() == "passwordreset") {
            content = <PasswordReset  user_id={params[1]} />
        }

        else if (params[0].toLowerCase() == "project") {
            if (params[2].toLowerCase() == "formbuilder") {
                content = <FormPage project={params[1]} id={params[3]} edit={true} params={params} />
            }
            else if (params[2].toLowerCase() == "view") {
                content = <FormPage project={params[1]} id={params[3]} edit={false} params={params} />
            }
        }

        return (
            <div className="App">
                <Wrapper content={content} loaded={this.state.loaded} />
            </div>
        );
    }
}

export default App;
