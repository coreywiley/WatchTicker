import React, { Component } from 'react';
import ajaxWrapper from "base/ajax.js";
import Wrapper from 'base/wrapper.js';

import {Form, TextInput, Select, PasswordInput, Navbar} from 'library';

class SignUp extends Component {
    constructor(props) {
        super(props);
        this.logIn = this.logIn.bind(this);
        this.logInCallback = this.logInCallback.bind(this);
    }

    logIn(value) {
      console.log("Form Value",value)
        ajaxWrapper('POST','/users/token/', {'email': value['form_state']['email'],'password': value['form_state']['password']}, this.logInCallback);
    }

    logInCallback(value) {
      localStorage.setItem('token', value['access']);
      localStorage.setItem('refresh_token', value['refresh'])
      localStorage.setItem('token_time', new Date())
      if (localStorage.getItem('redirect')) {
          var redirect = localStorage.getItem('redirect');
          localStorage.removeItem('redirect')
          window.location.href = redirect;
      }
      else {
          window.location.href = '/loggedIn/';
      }

    }

    render() {
        var Components = [TextInput,TextInput,TextInput, PasswordInput];
        var first_name_props = {'value':'','name':'first_name','label':'First Name:','placeholder': 'First Name'}
        var last_name_props = {'value':'','name':'last_name','label':'Last Name:','placeholder': 'Last Name'}
        var email_props = {'value':'','name':'email','label':'Email:','placeholder': 'component@madness.com'}
        var password_props = {'confirm_password':true};

        var ComponentProps = [first_name_props, last_name_props, email_props, password_props];
        var defaults = {'first_name':'','last_name':'', 'email':'', 'password':'','type':'User'};

        var submitUrl = "/api/user/user/";

        var content = <div className="container">
                <h2>Sign Up</h2>
                <Form components={Components} redirect={this.logIn} componentProps={ComponentProps} submitUrl={submitUrl} defaults={defaults} />
        </div>;


        return (
            <Wrapper loaded={true} content={content} />
             );
    }
}
export default SignUp;
