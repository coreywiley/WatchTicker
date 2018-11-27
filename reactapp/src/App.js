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

import BusinessForm from './pages/businessForm.js';
import DealForm from './pages/dealForm.js';
import EditUser from './pages/editUser.js';

import Deals from './pages/deals.js';
import Businesses from './pages/businesses.js';
import Business from './pages/business.js';
import Deal from './pages/deal.js';
import Redemption from './pages/redeemed.js';
import ManageYourBusinesses from './pages/manageYourBusinesses.js';
import CouponMetrics from './pages/couponMetrics.js';

import Nav from './projectLibrary/nav.js';
import Footer from './projectLibrary/footer.js';

import HowItWorks from './pages/how-it-works.js';
import TermsOfService from './pages/tos.js';
import About from './pages/about.js';
import Contact from './pages/contact.js';

import ManageBusinesses from './pages/manageBusinesses.js';

class App extends Component {
    constructor(props) {
        super(props);

        var params = this.getURL();
        var search = '';
        var address = null;
        var latLng = null;
        if (params[0] == 'deals') {
          if (params[1]) {
            search = params[1].split('_').join(' ');
          }
          latLng = params[3];
          address = params[2];
        }

        this.state = {
            loaded: false,
            csrfmiddlewaretoken: undefined,
            user:{'id':'', 'name':''},
            search: search,
            latLng: latLng,
            address: address,
        };

        this.ajaxCallback = this.ajaxCallback.bind(this);
        this.getUserInfo = this.getUserInfo.bind(this);
        this.getUserInfoCallback = this.getUserInfoCallback.bind(this);
        this.setGlobalSearch = this.setGlobalSearch.bind(this);
        this.setGlobalAddress = this.setGlobalAddress.bind(this);

    }

    setGlobalSearch(search) {
      this.setState({'search':search})
    }

    setGlobalAddress(address, latLng) {
      this.setState({'address':address, latLng: latLng})
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
      console.log("CSRF", value)
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

        if (window.location.pathname.toLowerCase().indexOf('login') == -1 && window.location.pathname.toLowerCase().indexOf('signup') == -1 && window.location.pathname.toLowerCase().indexOf('sockjs') == -1  && window.location.pathname.toLowerCase().indexOf('password') == -1 && window.location.pathname.toLowerCase().indexOf('log') == -1) {
          localStorage.setItem('redirect', window.location.pathname);
        }

        var adminPages = ['applist','models','modelinstances','modelinstancestable','instance', 'managebusinesses']
        var loggedInPages = ['manageYourBusinesses']
        var route = params[0].toLowerCase()


        var loading = <h1>Loading . . . </h1>;
        var content = null;

        if (this.state.loaded == true) {
          console.log("Admin", adminPages.indexOf(route), this.state.user.is_staff)
          if (params[0] === "") {
              //Home page
              content = <Home user_id={this.state.user.id}/>
          }
          else if (this.state.user.id == '' && loggedInPages.indexOf(route) > -1) {
            window.location.href = '/signUp/';
          }
          else if (this.state.user.is_staff == false && adminPages.indexOf(route) > -1) {
            window.location.href = '/';
          }
          else if (params[0].toLowerCase() === "components") {
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
          else if (params[0].toLowerCase() == "modelinstancestable") {
              content = <InstanceTable app={params[1]} model={params[2]} logOut={this.logOut}/>
          }
          else if (params[0].toLowerCase() == "instance") {
              content = <Instance app={params[1]} model={params[2]} id={params[3]} user_id={this.state.token} logOut={this.logOut}/>
          }
          else if (params[0].toLowerCase() == "login") {
              content = <LogIn />
          }
          else if (params[0].toLowerCase() == "signup") {
              content = <SignUp business={params[1]}/>
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
              content = <BusinessForm user_id={this.state.user.id} user={this.state.user} business_id={params[1]} />
          }
          else if (params[0].toLowerCase() == "dealform") {
              content = <DealForm user_id={this.state.user.id} business_id={params[1]} deal_id={params[2]} />
          }
          else if (params[0].toLowerCase() == "edituser") {
              content = <EditUser user_id={this.state.user.id} />
          }
          else if (params[0].toLowerCase() == "deals") {
              content = <Deals user_id={this.state.user.id} search={this.state.search} setGlobalSearch={this.setGlobalSearch} address={this.state.address} latLng={this.state.latLng} />
          }
          else if (params[0].toLowerCase() == "businesses") {
              content = <Businesses user_id={this.state.user.id} />
          }
          else if (params[0].toLowerCase() == "business") {
              content = <Business user_id={this.state.user.id} business_id={params[1]} is_staff={this.state.user.is_staff} />
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
          else if (params[0].toLowerCase() == "managebusinesses") {
              content = <ManageBusinesses user={this.state.user} user_id={this.state.user.id} />
          }
          else if (params[0].toLowerCase() == "manageyourbusinesses") {
              content = <ManageYourBusinesses user={this.state.user} user_id={this.state.user.id} />
          }
          else if (params[0].toLowerCase() == "couponmetrics") {
              content = <CouponMetrics user={this.state.user} user_id={this.state.user.id} business_id={params[1]} />
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
                  <Nav setGlobalAddress={this.setGlobalAddress} search={this.state.search} setGlobalSearch={this.setGlobalSearch} user_id={this.state.user.id} style={{'backgroundColor':'#234f9c !important'}} is_staff={this.state.user.is_staff}/>
                  <Wrapper content={content} loaded={this.state.loaded} />
                  <br />
                  <br />
                  <Footer />
            </div>
          );
        }

    }
}

export default App;
