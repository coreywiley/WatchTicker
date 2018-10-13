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

import BusinessForm from './pages/businessForm.js';
import DealForm from './pages/dealForm.js';
import EditUser from './pages/editUser.js';

import Deals from './pages/deals.js';
import Businesses from './pages/businesses.js';
import Business from './pages/business.js';
import Deal from './pages/deal.js';
import Redemption from './pages/redeemed.js';
import Nav from './projectLibrary/nav.js';

import HowItWorks from './pages/how-it-works.js';
import TermsOfService from './pages/tos.js';
import About from './pages/about.js';
import Contact from './pages/contact.js';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
            csrfmiddlewaretoken: undefined,
            user:{'id':'', 'name':''}
        };

        this.ajaxCallback = this.ajaxCallback.bind(this);
        this.getUserInfo = this.getUserInfo.bind(this);
        this.getUserInfoCallback = this.getUserInfoCallback.bind(this);
    }

    componentDidMount() {
        ajaxWrapper("GET", "/api/csrfmiddlewaretoken/", {}, this.ajaxCallback);
    }

    logOut() {
        console.log("Log Out");
        localStorage.removeItem('token')
        window.location.href = '/login/';
    }

    ajaxCallback(value) {

        window.secretReactVars["csrfmiddlewaretoken"] = value.csrfmiddlewaretoken;
        var token = localStorage.getItem('token')
        if (token) {
            if (window.location.href.indexOf('login') > -1 || window.location.href.indexOf('signup') > -1) {
                window.location.href = '/events/';
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
            content = <PasswordReset user_id={params[1]} />
        }
        else if (params[0].toLowerCase() == "businessform") {
            content = <BusinessForm user_id={this.state.user.id} business_id={params[1]} />
        }
        else if (params[0].toLowerCase() == "dealform") {
            content = <DealForm user_id={this.state.user.id} business_id={params[1]} deal_id={params[2]} />
        }
        else if (params[0].toLowerCase() == "edituser") {
            content = <EditUser user_id={this.state.user.id} />
        }
        else if (params[0].toLowerCase() == "deals") {
            content = <Deals user_id={this.state.user.id} />
        }
        else if (params[0].toLowerCase() == "businesses") {
            content = <Businesses user_id={this.state.user.id} />
        }
        else if (params[0].toLowerCase() == "business") {
            content = <Business user_id={this.state.user.id} business_id={params[1]} />
        }
        else if (params[0].toLowerCase() == "deal") {
            content = <Deal user={this.state.user} user_id={this.state.user.id} deal_id={params[1]} />
        }
        else if (params[0].toLowerCase() == "redeemed") {
            content = <Redemption user={this.state.user} user_id={this.state.user.id} redemption_id={params[1]} />
        }
        else if (params[0].toLowerCase() == "how-it-works") {
            content = <HowItWorks user={this.state.user} user_id={this.state.user.id} />
        }
        else if (params[0].toLowerCase() == "tos") {
            content = <TermsOfService user={this.state.user} user_id={this.state.user.id} />
        }
        else if (params[0].toLowerCase() == "about") {
            content = <About user={this.state.user} user_id={this.state.user.id} />
        }
        else if (params[0].toLowerCase() == "contact") {
            content = <Contact user={this.state.user} user_id={this.state.user.id} />
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
                  <Nav user_id={this.state.user.id} style={{'backgroundColor':'#234f9c !important'}}/>
                  <Wrapper content={content} loaded={this.state.loaded} />
                  <div className="footer-wrapper">
              			<footer className="site-footer-widgets" style={{'backgroundColor':'#2854a1'}}>
              				<div className="container">
              					<div className="row">
              						<div className="footer-widget-column col-xs-12 col-sm-12 col-lg-5">
              							<aside id="text-1" className="footer-widget widget_text">
                              <div className="textwidget">
                                <img src="http://beta.patrongate.com/wp-content/uploads/2018/07/pg_v3.png" style={{'width': '159px', 'marginBottom': '1em'}} />
                                <p>At PatronGate our purpose is to connect people with great local businesses.  Discover and search for exclusive deals on meals, drink specials, and more!</p>
                                <p>Made in the USA</p>
                                <p></p>
                              </div>
          		              </aside>
                          </div>
              						<div className="footer-widget-column col-xs-12 col-sm-6 col-lg-3 col-lg-offset-1">
              							<aside id="nav_menu-2" className="footer-widget widget_nav_menu">
                              <h4 className="footer-widget-title">Resources</h4>
                              <div className="menu-resources-container">
                                <ul id="menu-resources" className="menu">
                                  <li id="menu-item-13" className="menu-item menu-item-type-custom menu-item-object-custom menu-item-13"><a href="/contact/">Contact Us</a></li>
                                  <li id="menu-item-31" className="menu-item menu-item-type-post_type menu-item-object-page menu-item-31"><a href="/tos/">Terms of Service</a></li>
                                </ul>
                              </div>
                            </aside>
              						</div>
              						<div className="footer-widget-column col-xs-12 col-sm-6 col-lg-3">
              							<aside id="nav_menu-1" className="footer-widget widget_nav_menu">
                              <h4 className="footer-widget-title">Company</h4>
                              <div className="menu-company-container">
                                <ul id="menu-company" className="menu">
                                  <li id="menu-item-11" className="menu-item menu-item-type-custom menu-item-object-custom menu-item-11"><a href="/contact/">Customer Support</a></li>
                                  <li id="menu-item-12" className="menu-item menu-item-type-custom menu-item-object-custom menu-item-12"><a href="/about/">About PatronGate</a></li>
                                  <li id="menu-item-53" className="menu-item menu-item-type-post_type menu-item-object-page menu-item-53"><a href="/deals/">Deals of the Week</a></li>
                                </ul>
                              </div>
                            </aside>
              						</div>
              					</div>
              				</div>
              			</footer>

              	<footer id="colophon" className="site-footer" style={{'backgroundColor':'#22498e', 'color':'#a1b5d6'}}>
              		<div className="container">
              			<div className="site-info">
              				Copyright PatronGate © 2018 - All Rights Reserved
                    </div>
              			<div className="site-social"></div>
              		</div>
              	</footer>
              </div>
            </div>
          );
        }

    }
}

export default App;
