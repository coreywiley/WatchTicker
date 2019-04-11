import React, { Component } from 'react';
import {ajaxWrapper} from 'functions';
import {Wrapper} from 'library';

import {FormWithChildren, TextInput, Select, PasswordInput, Navbar, Alert, If, NumberInput, CSSInput} from 'library';

class SignUp extends Component {
    constructor(props) {
        super(props);
        this.config = {
            form_components: [
                <NumberInput label={'order'} name={'order'} />,
                <TextInput label={'redirectUrl'} name={'redirectUrl'} default={''} />,
                <CSSInput label={'css'} name={'style'} default={{}} />,
            ],
            can_have_children: true,
        }

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
              window.location.href = this.props.redirectUrl;
          }
        }
    }

    render() {

        var content =
        <div>
            <FormWithChildren submitUrl="/users/signup/" defaults={this.state} redirect={this.logIn}>
              <TextInput name="first_name" label="First Name" />
              <TextInput name="last_name" label="Last Name" />
              <TextInput name="email" label="Email" />
              <PasswordInput name="password" label="Password" confirm_password={true} />
            </FormWithChildren>
            <If logic={this.state.error}>
              <Alert type={'danger'} text={this.state.error} />
            </If>
        </div>;


        return (
            <Wrapper loaded={true} content={content} />
        );
    }
}
export default SignUp;
