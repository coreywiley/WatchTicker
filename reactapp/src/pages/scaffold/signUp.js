import React, { Component } from 'react';
import {ajaxWrapper} from 'functions';
import {Wrapper} from 'library';

import {Form, TextInput, Select, PasswordInput, Navbar, Alert} from 'library';

class SignUp extends Component {
    constructor(props) {
        super(props);
        this.state = {'error':null}
        this.logIn = this.logIn.bind(this);
    }

    logIn(value) {
        console.log(value);
        if (value['error']) {
          this.setState(value)
        }
        else {
          localStorage.setItem('token', value['access']);
          localStorage.setItem('refresh_token', value['refresh'])

          if (localStorage.getItem('redirect')) {
              var redirect = localStorage.getItem('redirect');
              localStorage.removeItem('redirect')
              window.location.href = redirect;
          }
          else {
              window.location.href = '/';
          }
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

        var submitUrl = "/users/signup/";

        var error = null;
        if (this.state.error) {
          error = <Alert type={'danger'} text={this.state.error} />
        }

        var content =
        <div className="container">
            <div className="row">
                <div className="col-md-4"></div>
                <div className="col-md-4">
                    <h2>Sign Up</h2>
                    <Form components={Components} redirect={this.logIn} componentProps={ComponentProps} submitUrl={submitUrl} defaults={defaults} />
                    {error}
                </div>
                <div className="col-md-4"></div>
            </div>
        </div>;


        return (
            <Wrapper loaded={true} content={content} />
        );
    }
}
export default SignUp;
