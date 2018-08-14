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
import InstanceTable from './pages/modelInstancesTable.js';

import LogIn from './pages/logIn.js';
import SignUp from './pages/signUp.js';
import Projects from './pages/projects.js';
import Question from './pages/question.js';
import Test from './pages/test.js';
import AnswerQuestion from './pages/answerQuestion.js';
import ReferenceGuide from './pages/referenceGuide.js';
import TrialQuestion from './pages/trialQuestion.js';
import TrialTest from './pages/trialTest.js';
import Passed from './pages/passed.js';
import Failed from './pages/trialTest.js';

import Conflicts from './pages/conflicts.js';
import Conflict from './pages/conflict.js';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
            csrfmiddlewaretoken: undefined,
            User:{'user_id':'', 'user_name':'', 'user_shorthand':''}
        };

        this.ajaxCallback = this.ajaxCallback.bind(this);
    }

    componentDidMount() {
        ajaxWrapper("GET", "/api/csrfmiddlewaretoken/", {}, this.ajaxCallback);
    }

    logOut() {
        console.log("Log Out")
        localStorage.removeItem('token')
        window.location.href = '/login/';
    }

    ajaxCallback(value) {
        console.log(value);
        window.secretReactVars["csrfmiddlewaretoken"] = value.csrfmiddlewaretoken;
        var token = localStorage.getItem('token')
        if (token) {
            if (window.location.href.indexOf('login') > -1) {
                window.location.href = '/projects/';
            }
            else {
                this.setState({loaded: true, csrfmiddlewaretoken: value.csrfmiddlewaretoken, token: token});
            }
        }
        else {
            if (window.location.href.indexOf('login') > -1 || window.location.href.indexOf('signUp') > -1) {
                this.setState({loaded: true, csrfmiddlewaretoken: value.csrfmiddlewaretoken});
            }
            else {
                window.location.href = '/login/';
            }
        }
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
            content = <AppList user_id={this.state.token} logOut={this.logOut}/>;
        }
        else if (params[0] == "models") {
            content = <ModelList app={params[1]} user_id={this.state.token} logOut={this.logOut}/>
        }
        else if (params[0] == "modelInstances") {
            content = <InstanceList app={params[1]} model={params[2]} user_id={this.state.token} logOut={this.logOut}/>
        }
        else if (params[0] == "modelInstancesTable") {
            content = <InstanceTable app={params[1]} model={params[2]} logOut={this.logOut}/>
        }
        else if (params[0] == "instance") {
            content = <Instance app={params[1]} model={params[2]} id={params[3]} user_id={this.state.token} logOut={this.logOut}/>
        }
        else if (params[0] == "login") {
            content = <LogIn />
        }
        else if (params[0] == "signUp") {
            content = <SignUp />
        }
        else if (params[0] == "projects") {
            content = <Projects user_id={this.state.token} logOut={this.logOut} />
        }
        else if (params[0] == "question") {
            content = <Question question_id={params[1]} user_id={this.state.token} logOut={this.logOut} user_name={this.state.User.user_name} user_short_name={this.state.User.user_shorthand} />
        }
        else if (params[0] == "test") {
            content = <Test logOut={this.logOut} user_id={this.state.token} project_id={params[1]} />
        }
        else if (params[0] == 'answerQuestion') {
          content = <AnswerQuestion question_id={params[1]} user_id={this.state.token} />
        }
        else if (params[0] == 'referenceGuide') {
          content = <ReferenceGuide question_id={params[1]} user_id={this.state.token} />
        }
        else if (params[0] == 'trialQuestion') {
          content = <TrialQuestion question_id={params[1]} user_id={this.state.token} />
        }
        else if (params[0] == 'trialTest') {
          content = <TrialTest question_id={params[1]} user_id={this.state.token} />
        }
        else if (params[0] == 'passed') {
          content = <Passed question_id={params[1]} user_id={this.state.token} />
        }
        else if (params[0] == 'failed') {
          content = <Failed question_id={params[1]} user_id={this.state.token} />
        }
        else if (params[0] == "conflict") {
            content = <Conflict answer_id={params[1]} user_id={this.state.token} logOut={this.logOut} />
        }
        else if (params[0] == "conflicts") {
            content = <Conflicts logOut={this.logOut} user_id={this.state.token} question_id={params[1]} />
        }


        return (
            <div className="App">
                <Wrapper content={content} loaded={this.state.loaded} />
            </div>
        );
    }
}

export default App;
