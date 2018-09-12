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

import Events from './pages/events.js';
import NewEvent from './pages/newEvent.js';
import NewCustomer from './pages/newCustomer.js';
import Customers from './pages/customers.js';
import NewMenuItem from './pages/newMenuItem.js';
import MenuItems from './pages/menuItems.js';
import ShoppingListItems from './pages/shoppingListItems.js';
import NewShoppingListItem from './pages/newShoppingListItem.js';
import PrepListItems from './pages/prepListItems.js';
import NewPrepListItem from './pages/newPrepListItem.js';
import DecorationListItems from './pages/decorationListItems.js';
import NewDecorationListItem from './pages/newDecorationListItem.js';
import PackListItems from './pages/packListItems.js';
import NewPackListItem from './pages/newPackListItem.js';
import Menu from './pages/menu.js';

import ShopList from './pages/shopList.js';
import PrepList from './pages/prepList.js';
import PackList from './pages/packList.js';
import DecorationList from './pages/decorList.js';

import DailyPrepList from './pages/dailypreplist.js';

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
        console.log("Log Out")
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
            content = <AppList user_id={this.state.token} logOut={this.logOut}/>;
        }
        else if (params[0].toLowerCase() == "models") {
            content = <ModelList app={params[1]} user_id={this.state.token} logOut={this.logOut}/>
        }
        else if (params[0].toLowerCase() == "modelInstances") {
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
        else if (params[0].toLowerCase() == "events") {
            content = <Events user_id={this.state.user.id} logOut={this.logOut}/>
        }
        else if (params[0].toLowerCase() == "newevent") {
            content = <NewEvent user_id={this.state.user.id} event_id={params[1]}  logOut={this.logOut}/>
        }
        else if (params[0].toLowerCase() == "newcustomer") {
            content = <NewCustomer user_id={this.state.user.id} customer_id={params[1]}  logOut={this.logOut}/>
        }
        else if (params[0].toLowerCase() == "customers") {
            content = <Customers user_id={this.state.user.id} logOut={this.logOut}/>
        }
        else if (params[0].toLowerCase() == "menuitems") {
            content = <MenuItems user_id={this.state.user.id} logOut={this.logOut}/>
        }
        else if (params[0].toLowerCase() == "newmenuitem") {
            content = <NewMenuItem user_id={this.state.user.id} fooditem_id={params[1]}  logOut={this.logOut}/>
        }
        else if (params[0].toLowerCase() == "shoplistitems") {
          console.log("Check ceh")
            content = <ShoppingListItems user_id={this.state.user.id} fooditem_id={params[1]}  logOut={this.logOut}/>
        }
        else if (params[0].toLowerCase() == "newshoppinglistitem") {
            content = <NewShoppingListItem user_id={this.state.user.id} fooditem_id={params[1]} shoppinglistitem_id={params[2]} logOut={this.logOut}/>
        }
        else if (params[0].toLowerCase() == "preplistitems") {
          console.log("Check ceh")
            content = <PrepListItems user_id={this.state.user.id} fooditem_id={params[1]}  logOut={this.logOut}/>
        }
        else if (params[0].toLowerCase() == "newpreplistitem") {
            content = <NewPrepListItem user_id={this.state.user.id} fooditem_id={params[1]} shoppinglistitem_id={params[2]} logOut={this.logOut}/>
        }
        else if (params[0].toLowerCase() == "decorationlistitems") {
          console.log("Check ceh")
            content = <DecorationListItems user_id={this.state.user.id} fooditem_id={params[1]}  logOut={this.logOut}/>
        }
        else if (params[0].toLowerCase() == "newdecorationlistitem") {
            content = <NewDecorationListItem user_id={this.state.user.id} fooditem_id={params[1]} shoppinglistitem_id={params[2]} logOut={this.logOut}/>
        }
        else if (params[0].toLowerCase() == "packlistitems") {
          console.log("Check ceh")
            content = <PackListItems user_id={this.state.user.id} fooditem_id={params[1]}  logOut={this.logOut}/>
        }
        else if (params[0].toLowerCase() == "newpacklistitem") {
            content = <NewPackListItem user_id={this.state.user.id} fooditem_id={params[1]} shoppinglistitem_id={params[2]} logOut={this.logOut}/>
        }
        else if (params[0].toLowerCase() == "menu") {
            content = <Menu user_id={this.state.user.id} event_id={params[1]} logOut={this.logOut}/>
        }
        else if (params[0].toLowerCase() == "shoplist") {
            content = <ShopList user_id={this.state.user.id} event_id={params[1]} logOut={this.logOut}/>
        }
        else if (params[0].toLowerCase() == "preplist") {
            content = <PrepList user_id={this.state.user.id} event_id={params[1]} logOut={this.logOut}/>
        }
        else if (params[0].toLowerCase() == "packlist") {
            content = <PackList user_id={this.state.user.id} event_id={params[1]} logOut={this.logOut}/>
        }
        else if (params[0].toLowerCase() == "decorlist") {
            content = <DecorationList user_id={this.state.user.id} event_id={params[1]} logOut={this.logOut}/>
        }
        else if (params[0].toLowerCase() == "dailypreplist") {
            content = <DailyPrepList user_id={this.state.user.id} logOut={this.logOut} />
        }



        return (
            <div className="App">
                <Wrapper content={content} loaded={this.state.loaded} />
            </div>
        );
    }
}

export default App;
