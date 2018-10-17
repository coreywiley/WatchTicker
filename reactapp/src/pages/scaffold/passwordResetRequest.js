import React, { Component } from 'react';
import ajaxWrapper from "base/ajax.js";
import Wrapper from 'base/wrapper.js';

import {Form, TextInput, Select, PasswordInput, Alert, Header, Button} from 'library';
import Navbar from 'projectLibrary/nav.js';

class PasswordResetRequest extends Component {
    constructor(props) {
        super(props);
        this.state = {'email':'', 'error':false, 'sent':false}
        this.emailCallback = this.emailCallback.bind(this);
        this.email = this.email.bind(this);
        this.userLookup = this.userLookup.bind(this);
    }

    handleChange = (e) => {
       var name = e.target.getAttribute("name");
       var newState = {};
       newState[name] = e.target.value;

        var newCompleteState = this.state;
        newCompleteState[name] = e.target.value;
       this.setState(newState);
    }

    userLookup() {
      ajaxWrapper('GET','/api/user/user/?email=' + this.state.email, {}, this.email)
    }

    email(result) {
      if (result.length > 0) {
        var user = result[0]['user']
        ajaxWrapper('POST','/api/email/', {'to_email':user.email, 'from_email':'jeremy.thiesen1@gmail.com','subject':'Password Reset','text':'You can reset your password at .../passwordReset/' + user.id +'/'}, this.emailCallback)
      }
      else {
        this.setState({'error':true})
      }
    }

    emailCallback(result) {
      console.log("Email Sent");
      this.setState({sent:true})
    }

    render() {
        var email_props = {'value':this.state.email,'name':'email','label':'Email:','placeholder': 'component@madness.com', 'handlechange':this.handleChange}

        var submitUrl = "/api/user/user/";

        var alert = <div></div>;
        if (this.state.error == true) {
          alert = <Alert text={'No user found with that email.'} type={'danger'} />
        }

        var sent = <div></div>;
        if (this.state.sent == true) {
          sent = <Alert text={'Your password reset email has been sent.'} type={'success'} />
        }

        var content = <div className="container">
                <Header size={2} text={"Add your email and we'll send you a link to reset your password."} />
                <TextInput {...email_props} />
                <Button type={'success'} text={'Reset Password'} clickHandler={this.userLookup} />
                {alert}
                {sent}
        </div>;

        return (
          <div>
            <Navbar is_staff={this.props.is_staff} logged_in={false} />
            <Wrapper loaded={this.state.loaded}  content={content} />
          </div>
             );
    }
}
export default PasswordResetRequest;
