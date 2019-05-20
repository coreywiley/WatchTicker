import React, { Component } from 'react';
import './App.css';
import {ajaxWrapper, setGlobalState} from "functions";
import {Wrapper} from 'library';
import Nav from './projectLibrary/nav.js';

//Component Madness
import PageList from './pages/page_builder/pageList.js';
import PageBuilder from './pages/page_builder/pageBuilder.js';

*component_imports*

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
          else if (route == 'pagebuilder') {
            content = <PageBuilder page_id={params[2]} page_group_id={params[1]} />
          }
          else if (route == 'pagelist') {
            content = <PageList />
          }
*app_routes*
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
