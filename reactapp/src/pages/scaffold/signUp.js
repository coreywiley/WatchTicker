import React, { Component } from 'react';
import ajaxWrapper from "base/ajax.js";
import Wrapper from 'base/wrapper.js';

import {Form, TextInput, Select, PasswordInput, Navbar, NumberInput} from 'library';

class SignUp extends Component {
    constructor(props) {
        super(props);
        this.logIn = this.logIn.bind(this);
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

    render() {
        var Components = [TextInput,TextInput,TextInput, TextInput, NumberInput, Select, TextInput, PasswordInput];
        var first_name_props = {'value':'','name':'first_name','label':'First Name','placeholder': 'First Name', 'required':true}
        var last_name_props = {'value':'','name':'last_name','label':'Last Name','placeholder': 'Last Name'}
        var email_props = {'value':'','name':'email','label':'Email','placeholder': 'somanydeals@patrongate.com', 'required':true}
        var password_props = {'confirm_password':true, 'required':true};
        var phone =  {'value':'','name':'phone','label':'Phone Number','placeholder': '(651) 123-4567'}
        var age =  {'value':'','name':'age','label':'Age','placeholder': 23}
        var gender =  {'value':'','name':'gender','label':'Gender','options':[{'value':'Pick One','text':'Pick One'}, {'value':'Male', 'text':'Male'}, {'value':'Female','text':'Female'},{'value':'Other','text':"I don't identify as either"}]}
        var zipcode =  {'value':'','name':'zipcode','label':'Zip Code','placeholder': '55104'}

        var ComponentProps = [first_name_props, last_name_props, email_props, phone, age, gender, zipcode, password_props];
        var defaults = {'first_name':'','last_name':'', 'email':'', 'password':'','type':'User', 'gender':'Pick One', 'zipcode':'', 'age':'','phone':''};

        var submitUrl = "/users/signup/";

        var content = <div className="container">
                <h2>Sign Up</h2>
                <p>Sign Up To Redeem Deals or Add Your Business</p>
                <Form components={Components} redirect={this.logIn} componentProps={ComponentProps} submitUrl={submitUrl} defaults={defaults} />
        </div>;


        return (
            <Wrapper loaded={true} content={content} />
             );
    }
}
export default SignUp;
