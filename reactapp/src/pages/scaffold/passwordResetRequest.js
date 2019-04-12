import React, { Component } from 'react';
import {ajaxWrapper} from 'functions';
import {Wrapper} from 'library';

import {FormWithChildren, If, TextInput, Alert, Header, Button} from 'library';

class PasswordResetRequest extends Component {
    constructor(props) {
        super(props);
        this.state = {'email':'', 'error':false, 'sent':false, 'loaded':true}

        this.config = {
            form_components: [
                <NumberInput label={'order'} name={'order'} />,
            ],
            can_have_children: true,
        }

        this.userLookup = this.userLookup.bind(this);
        this.emailCallback = this.emailCallback.bind(this);
        this.email = this.email.bind(this);
    }

    userLookup() {
      ajaxWrapper('POST', '/users/userCheck/', {'email':this.state.email}, this.email)
    }

    email(result) {
      console.log('EMAIL', result);
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
        var content = <div className="container">
                <Header size={2} text={"Add your email and we'll send you a link to reset your password."} />
                <FormWithChildren autoSetGlobalState={true} setGlobalState={this.setGlobalState} globalStateName={'form'}>
                  <TextInput default={this.state.email} name="email" label="Email" placeholder="component@madness.com" />
                </FormWithChildren>
                <Button type={'success'} text={'Reset Password'} clickHandler={this.userLookup} />
                <If logic={this.state.sent}>
                  <Alert text={'Your password reset email has been sent.'} type={'success'} />
                </If>
                <If logic={this.state.error}>
                  <Alert text={'No user found with that email.'} type={'danger'} />
                </If>
        </div>;

        return (
            <Wrapper loaded={this.state.loaded}  content={content} />
         );
    }
}
export default PasswordResetRequest;
