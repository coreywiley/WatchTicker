import React, { Component } from 'react';
import ajaxWrapper from "base/ajax.js";
import Wrapper from 'base/wrapper.js';

import {Form, TextInput, Select, PasswordInput, Navbar, Alert} from 'library';

class SignUp extends Component {
    constructor(props) {
        super(props);
        this.state = {'error':null, 'host' : {'name':''}, 'name' : '', 'description' : '', 'length' : '30', 'holidays' : 'false', 'loaded':false}
        this.logIn = this.logIn.bind(this);
    }


    componentDidMount(value) {
        ajaxWrapper('GET','/api/home/event/' + this.props.event_id + '/?related=host', {}, this.objectCallback);
    }

    objectCallback(result) {
      var event = result[0]['event'];
      event['loaded'] = true;
      this.setState(event)
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
              window.location.href = '/event/' + this.props.event_id + '/';
          }
        }
    }

    render() {
        var Components = [TextInput,TextInput,TextInput,Select];
        var first_name_props = {'value':'','name':'first_name','label':'First Name:','placeholder': 'First Name'}
        var last_name_props = {'value':'','name':'last_name','label':'Last Name:','placeholder': 'Last Name'}
        var email_props = {'value':'','name':'email','label':'Email:','placeholder': 'component@madness.com'}
        var notifactions = {'name': 'notifications', 'label': 'Get A Reminder Before The Event?', 'placeholder': 'Holidays', 'value': true, 'options': [{'value':true,'text':'Yes'},{'value':false,'text':'No'}]};

        var ComponentProps = [first_name_props, last_name_props, email_props, notifactions];
        var defaults = {'first_name':'','last_name':'', 'email':'', 'password':'','type':'User', 'notifications':true};

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
                    <h2>Let {this.state.host.first_name} know who they are meeting with for {this.state.name}.</h2>
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
