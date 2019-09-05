import React, { Component } from 'react';
import './App.css';
import {ajaxWrapper, setGlobalState} from "functions";
import {Wrapper} from 'library';
import Nav from './projectLibrary/nav.js';

//Component Madness
import PageList from './pages/page_builder/pageList.js';
import PageBuilder from './pages/page_builder/pageBuilder.js';

import PasswordReset from "./pages/folder/passwordreset.js"
import LogIn from "./pages/folder/login.js"
import Home from "./pages/folder/home.js"
import PasswordResetRequestPage from "./pages/folder/passwordresetrequestpage.js"
import SignUpFormPage from "./pages/folder/signupformpage.js"
import ViewWatch from "./pages/folder/viewwatch.js"
import CreateWatch from "./pages/folder/createwatch.js"
import EditSources from "./pages/folder/editsources.js"
import CreateSources from "./pages/folder/createsources.js"
import Watch_InstanceList from "./pages/folder/watch_instancelist.js"
import WatchList from "./pages/folder/watchlist.js"
import EditUser from "./pages/folder/edituser.js"
import UserList from "./pages/folder/userlist.js"
import EditWatch from "./pages/folder/editwatch.js";
import SourceList from './pages/folder/sourceList.js';
import RequestList from './pages/folder/watch_requests.js';
import WatchRequest from './pages/folder/watch_request.js';
import PriceMoves from './pages/folder/price_moves.js';

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
//116234
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
          else if (route == 'pagebuilder') {
            content = <PageBuilder page_id={params[2]} page_group_id={params[1]} />
          }
          else if (route == 'pagelist') {
            content = <PageList />
          }
          else if (route == "passwordreset") {
             var content = <PasswordReset user_id={params[1]} />
          }
          else if (route == "login") {
             var content = <LogIn />
          }
          else if (route == "") {
             var content = <Home />
          }
          else if (route == "passwordresetrequest") {
             var content = <PasswordResetRequestPage />
          }
          else if (route == "watch") {
             var content = <ViewWatch />
          }
          else if (route == "createwatch") {
             var content = <CreateWatch />
          }
          else if (route == "editsource") {
             var content = <EditSources />
          }
          else if (route == "createsource") {
             var content = <CreateSources />
          }
          else if (route == "watchinstances") {
             var content = <Watch_InstanceList />
          }
          else if (route == "watches") {
             var content = <WatchList id={params[1]} />
          }
          else if (route == "edituser") {
             var content = <EditUser />
          }
          else if (route == "users") {
             var content = <UserList />
          }
          else if (route == "editwatch") {
             var content = <EditWatch />
          }
          else if (route == 'sources') {
              var content = <SourceList />
          }
          else if (route == 'watchrequests') {
              var content = <RequestList />
          }
          else if (route == 'watchrequest') {
              var content = <WatchRequest id={params[1]} />
          }
          else if (route == 'pricemoves') {
              var content = <PriceMoves />
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
                  <Nav user={this.state.user} />
                  <Wrapper style={{paddingTop: '60px'}} content={content} loaded={this.state.loaded} />
            </div>
          );
        }
    }
}

export default App;
