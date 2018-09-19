import React, { Component } from 'react';
import ajaxWrapper from "base/ajax.js";
import Wrapper from 'base/wrapper.js';

import {Form, TextInput, Select, PasswordInput, Header} from 'library';
import Navbar from 'projectLibrary/nav.js';

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
          window.location.href = '/events/';
      }

    }

    render() {
        var Components = [TextInput,TextInput,TextInput, TextInput, PasswordInput];
        var first_name_props = {'value':'','name':'first_name','label':'First Name:','placeholder': 'First Name'}
        var last_name_props = {'value':'','name':'last_name','label':'Last Name:','placeholder': 'Last Name'}
        var company_props = {'value':'','name':'company','label':'Company Name:','placeholder': 'Company Name'}
        var email_props = {'value':'','name':'email','label':'Email:','placeholder': 'component@madness.com'}
        var password_props = {'confirm_password':true};

        var ComponentProps = [first_name_props, last_name_props, company_props, email_props, password_props];
        var defaults = {'first_name':'','last_name':'', 'email':'', 'password':'','type':'User'};

        var submitUrl = "/api/user/user/";

        var content = <div className="container">
                <Header size={2} text={'Sign Up'} />
                <Form components={Components} redirect={this.logIn} componentProps={ComponentProps} submitUrl={submitUrl} defaults={defaults} />
                <small className="form-text">Already a user? <a href="/logIn/">Log In</a></small>
        </div>;


        return (
          <div>
            <Navbar logged_in={false} />
            <Wrapper loaded={true}  content={content} />
          </div>
             );
    }
}
export default SignUp;
