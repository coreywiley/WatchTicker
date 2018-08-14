import React, { Component } from 'react';
import ajaxWrapper from "base/ajax.js";
import Wrapper from 'base/wrapper.js';

import {Form, TextInput, Select, PasswordInput, Navbar} from 'library';

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
            window.location.href = '/projects/';
        }
    }

    render() {
        var Components = [TextInput,TextInput,TextInput, TextInput, Select, TextInput, PasswordInput];
        var first_name_props = {'value':'','name':'first_name','label':'First Name:','placeholder': 'First Name'}
        var last_name_props = {'value':'','name':'last_name','label':'Last Name:','placeholder': 'Last Name'}
        var email_props = {'value':'','name':'email','label':'Email:','placeholder': 'math@anex.com'}
        var phone_props = {'value':'', 'name':'phone','label':'Phone','placeholder': '(xxx) xxx-xxxx'}
        var options = [{'value':'Select One','text':'Select One'},{'value':'Teacher','text':'Teacher'}, {'value':'Student Teacher','text':'Student Teacher'}, {'value':'Grad Student','text':'Grad Student'}, {'value':'Math Coach or TOSA','text':'Math Coach or TOSA'}, {'value':'Administrator','text':'Administrator'}, {'value':'Other','text':'Other'}]
        var job_props = {'value':'', 'name':'job','label':'What do you currently do?','placeholder': 'Select One', 'options':options}
        var location_props = {'value':'','name':'location','label':'Where do you work or attend school?','placeholder': 'University of Chicago'}
        var password_props = {'confirm_password':true};

        var ComponentProps = [first_name_props, last_name_props, email_props, phone_props, job_props, location_props, password_props];
        var defaults = {'first_name':'','last_name':'', 'email':'', 'phone':'', 'location':'', 'password':'','type':'User', 'job':'Select One'};
        var name = <div><img src='../static/images/AnexLogo.PNG' height="30" width="30" /><strong>ANEX</strong></div>;


        var submitUrl = "/api/user/user/";

        var content = <div className="container">
                <Navbar nameLink={'/logIn/'} name={name} />
                <h2>Sign Up</h2>
                <Form components={Components} redirect={this.logIn} componentProps={ComponentProps} submitUrl={submitUrl} defaults={defaults} />
        </div>;


        return (
            <Wrapper loaded={true} content={content} />
             );
    }
}
export default SignUp;
