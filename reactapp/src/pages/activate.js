import React, { Component } from 'react';
import ajaxWrapper from "base/ajax.js";
import Wrapper from 'base/wrapper.js';

import {Form, TextInput, Select, PasswordInput, Navbar} from 'library';

class SignUp extends Component {
    constructor(props) {
        super(props);

        this.state = {'first_name':'','last_name':'','email':'', 'loaded':false}

        this.logIn = this.logIn.bind(this);
        this.userCallback = this.userCallback.bind(this);

    }

    logIn(value) {
        console.log(value);

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

    componentDidMount() {
      ajaxWrapper('GET','/api/user/user/?id=' + this.props.user_id, {}, this.userCallback)
    }

    userCallback(result) {
      var user = result[0]['user'];
      user['loaded'] = true;
      this.setState(user)
    }

    render() {
        var Components = [TextInput,TextInput,TextInput, PasswordInput];
        var first_name_props = {'value':this.state.first_name,'name':'first_name','label':'First Name:','placeholder': 'First Name'}
        var last_name_props = {'value':this.state.last_name,'name':'last_name','label':'Last Name:','placeholder': 'Last Name'}
        var email_props = {'value':this.state.email,'name':'email','label':'Email:','placeholder': 'alex@argnnn.com'}
        var password_props = {'confirm_password':true};

        var ComponentProps = [first_name_props, last_name_props, email_props, password_props];
        var defaults = {'first_name':this.state.first_name,'last_name':this.state.last_name, 'email':this.state.email, 'is_active':true, 'password':'','type':'User'};

        var submitUrl = "/api/user/user/" + this.props.user_id;

        var content = <div className="container">
                <h2>Activate Your Account</h2>
                <Form components={Components} redirect={this.logIn} componentProps={ComponentProps} submitUrl={submitUrl} defaults={defaults} />
        </div>;


        return (
            <Wrapper loaded={this.state.loaded} content={content} />
             );
    }
}
export default SignUp;
