import React, { Component } from 'react';
import './App.css';
import {ajaxWrapper, setGlobalState} from "functions";
import {Wrapper} from 'library';

//Component Madness
import PageList from './pages/page_builder/pageList.js';
import PageBuilder from './pages/page_builder/pageBuilder.js';

//Admin
import AppList from './pages/admin/appList.js';
import ModelList from './pages/admin/modelsList.js';
import InstanceList from './pages/admin/modelInstances.js';
import Instance from './pages/admin/instance.js';
import InstanceTable from './pages/admin/modelInstancesTable.js';

//Scaffolding
import LogIn from './pages/scaffold/logIn.js';
import SignUp from './pages/scaffold/signUp.js';
import PasswordResetRequest from './pages/scaffold/passwordResetRequest.js';
import PasswordReset from './pages/scaffold/passwordReset.js';

import Home from './pages/scaffold/home.js';
import Nav from 'projectLibrary/nav.js';
//import Footer from 'projectLibrary/footer.js';
import ModelMaker from './pages/model_builder/djangoModelMaker.js';

//API Querying
import APIDocs from './pages/admin/apiDocs.js';


class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
            csrfmiddlewaretoken: undefined,
            user:{}
        };

        this.ajaxCallback = this.ajaxCallback.bind(this);
        this.loadUser = this.loadUser.bind(this);
    }

    componentDidMount() {
        ajaxWrapper("GET", "/api/csrfmiddlewaretoken/", {}, this.ajaxCallback);

        var path = this.getURL()[0].toLowerCase();

        var token = localStorage.getItem('token');

        var loginNoRedirects = ['login','signup','passwordresetrequest', 'passwordreset', 'admin', 'modelmaker'];

        if (token) {
            ajaxWrapper("GET", "/users/user/", {}, this.loadUser.bind(this));
            this.setState({token: token});
            if (path.indexOf('login') > -1) {
                window.location.href = '/watches/';
            }
        } else if (loginNoRedirects.indexOf(path) == -1 && window.location.pathname != "/") {
            window.location.href = '/login/';
        }
        else {
          this.setState({'loaded':true})
        }
    }

    loadUser(result){
      console.log("Load User Result", result)
      window.cmState.setGlobalState('user',result)
        this.setState({
            user: result, loaded: true,
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
        var params = this.getURL();
        var param_dict = {};
        for (var index in params) {
          param_dict[index.toString()] = params[index]
        }
        window.cmState.setGlobalState('params',param_dict)

        var adminPages = [
            'applist','models','modelinstances',
            'modelinstancestable','instance',
        ];

        var loggedInPages = [];
        var route = params[0].toLowerCase();

        var loading = <h1>Loading . . . </h1>;
        var content = null;
        var navbar = null;

        if (this.state.loaded) {
          var navbar = <Nav user_id={this.state.user.id} is_staff={this.state.user.is_staff} logOut={this.logOut} />
          if (adminPages.indexOf(route) > -1 && this.state.loaded && !(this.state.user.is_staff)){
              //window.location = '/';
              console.log("Not an admin", this.state.loaded, this.state.user)
          } else if (loggedInPages.indexOf(route) > -1 && this.state.loaded && typeof(this.state.user.id) != 'undefined'){
              //window.location = '/login/';
              console.log("Need to be logged in");
          }
          else if (route == 'logout') {
            this.logOut();
          }
          else if (route === "admin") {
              //List components
              content = <Home admin={'admin'} />;
          }
          else if (route == "applist") {
              content = <AppList user_id={this.state.token}/>;
          }
          else if (route == "models") {
              content = <ModelList app={params[1]} user_id={this.state.token}/>;
          }
          else if (route == "modelinstances") {
              content = <InstanceList app={params[1]} model={params[2]} user_id={this.state.token}/>;
          }
          else if (route == "modelinstancestable") {
              content = <InstanceTable app={params[1]} model={params[2]}/>;
          }
          else if (route == "modelmaker") {
              content = <ModelMaker user_id={this.state.token}/>;
          }
          else if (route == "instance") {
              content = <Instance app={params[1]} model={params[2]} id={params[3]} user_id={this.state.token}/>;
          }
          else if (route == 'apidocs') {
            content = <APIDocs />
          }
          else if (route == 'pagebuilder') {
            content = <PageBuilder page_id={params[2]} page_group_id={params[1]} />
          }
          else if (route == 'pagelist') {
            content = <PageList />
          }
          else {
            var formatRoute = "/" + route + "/"
            if (route == "") {
              formatRoute = "/"
            }
            content = <PageBuilder show={true} route={formatRoute} />
          }
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
                  <Wrapper style={{paddingTop: '60px'}} content={content} loaded={this.state.loaded} />
            </div>
          );
        }
    }
}

export default App;
