import React, { Component } from 'react';
import {ajaxWrapper} from 'functions';
import {Wrapper} from 'library';

import {FormWithChildren, TextInput, Select, PasswordInput, Navbar, Alert, If} from 'library';

class SignUp extends Component {
    constructor(props) {
        super(props);
        this.state = {'error':null, 'first_name':'','last_name':'', 'email':'', 'password':'','type':'User'}
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

        var content =
        <div className="container">
            <div className="row">
                <div className="col-md-4"></div>
                <div className="col-md-4">
                    <h2>Sign Up</h2>
                    <FormWithChildren submitUrl="/users/signup" defaults={this.state} redirect={this.logIn}>
                      <TextInput name="first_name" label="First Name" />
                      <TextInput name="last_name" label="Last Name" />
                      <TextInput name="email" label="Email" />
                      <PasswordInput name="password" label="Password" confirm_password={true} />
                    </FormWithChildren>
                    <If logic={this.state.error}>
                      <Alert type={'danger'} text={this.state.error} />
                    </If>
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
