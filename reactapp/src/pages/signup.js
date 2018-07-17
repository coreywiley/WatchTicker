import React, { Component } from 'react';
import ajaxWrapper from "../base/ajax.js";
import Wrapper from '../base/wrapper.js';
import getComponent from '../componentResolver.js';

import Form from '../library/form.js';
import TextInput from '../library/textinput.js';
import FileInput from '../library/fileinput.js';
import HiddenInput from '../library/hiddeninput.js';
import PasswordInput from '../library/passwordinput.js';

class SignUp extends Component {
    constructor(props) {
        super(props);

        this.logIn = this.logIn.bind(this);

    }

    logIn(value) {

        localStorage.setItem('user_id', value['user_id']);
        localStorage.setItem('user_name', value['user_name']);
        if (localStorage.getItem('redirect')) {
            var redirect = localStorage.getItem('redirect');
            localStorage.removeItem('redirect')
            window.location.href = redirect;
        }
        else {
            window.location.href = '/';
        }

    }



    render() {
        var Components = [TextInput,TextInput,TextInput, PasswordInput];
        var first_name_props = {'value':'','name':'first_name','label':'First Name:','placeholder': 'First Name'}
        var last_name_props = {'value':'','name':'last_name','label':'Last Name:','placeholder': 'Last Name'}
        var email_props = {'value':'','name':'email','label':'Email:','placeholder': 'crash@pad.com'}
        var password_props = {'confirm_password':true};

        var ComponentProps = [first_name_props, last_name_props, email_props, password_props];
        var defaults = {'first_name':'','last_name':'', 'email':'', 'phone':'', 'imageUrl':'', 'password':'','type':'User'};


        if (this.props.user_id) {
         var submitUrl = "/api/user/user/" + this.props.user_id + "/";

        var content = <div className="container">

                <h2>Sign Up</h2>
                <Form components={Components} dataUrl={submitUrl} first={true} objectName={'user'} redirectUrl={"/editUser/"} componentProps={ComponentProps} submitUrl={submitUrl} defaults={defaults} />

        </div>;

        }
        else {
        var submitUrl = "/api/user/user/";

        var content = <div className="container">

                <h2>Sign Up</h2>
                <Form components={Components} redirect={this.logIn} componentProps={ComponentProps} submitUrl={submitUrl} defaults={defaults} />

        </div>;
        }

        return (
            <Wrapper loaded={true} content={content} />
             );
    }
}
export default SignUp;