import React, { Component } from 'react';
import ajaxWrapper from "base/ajax.js";
import Wrapper from 'base/wrapper.js';

import {Form, TextInput, Select, PasswordInput, Navbar} from 'library';
import Nav from 'projectLibrary/loggedOutNav.js';

class SignUp extends Component {
    constructor(props) {
        super(props);
        this.logIn = this.logIn.bind(this);
    }

    logIn(value) {
        console.log(value);

        localStorage.setItem('token', value[0]['user']['id']);
        if (localStorage.getItem('redirect')) {
            var redirect = localStorage.getItem('redirect');
            localStorage.removeItem('redirect')
            window.location.href = redirect;
        }
        else {
            window.location.href = '/dashboard/';
        }
    }

    render() {
        var Components = [TextInput, PasswordInput];
        var first_name_props = {'value':'','name':'first_name','label':'First Name:','placeholder': 'First Name'}
        var last_name_props = {'value':'','name':'last_name','label':'Last Name:','placeholder': 'Last Name'}
        var email_props = {'value':'','name':'email','label':'Email:','placeholder': 'emoji@slider.com'}
        var password_props = {'confirm_password':true};

        var ComponentProps = [email_props, password_props];
        var defaults = {'email':'', 'password':'','type':'User'};

        var submitUrl = "/api/user/user/";

        var content = <div className="container">
                <h2>Sign Up</h2>
                <Form components={Components} redirect={this.logIn} componentProps={ComponentProps} submitUrl={submitUrl} defaults={defaults} />
        </div>;


        return (
            <div>
            <Nav />
            <Wrapper loaded={true} content={content} />
            </div>
             );
    }
}
export default SignUp;
