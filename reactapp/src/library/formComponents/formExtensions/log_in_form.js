import React, { Component } from 'react';
import {ajaxWrapper, resolveVariables} from 'functions';
import {FormWithChildren, TextInput, Button, PasswordInput, Alert, If, NumberInput, CSSInput} from 'library';

class LogInForm extends Component {
    constructor(props) {
        super(props);
        this.config = {
            form_components: [
                
                <TextInput label={'redirectUrl'} name={'redirectUrl'} default={''} />,
                <CSSInput label={'css'} name={'style'} default={{}} />,
            ],
            can_have_children: true,
        }

        this.state = {email:'',error:'', password: ''};

        this.formSubmit = this.formSubmit.bind(this);
        this.formSubmitCallback = this.formSubmitCallback.bind(this);
        this.setGlobalState = this.setGlobalState.bind(this);

    }

    setGlobalState(name, state) {
      this.setState(state)
    }


    formSubmit() {
        console.log("Submitting", this.state, '/users/token/');
        var data = Object.assign({},this.state);
        delete data['children']
        data['email'] = data['email'].toLowerCase()
        ajaxWrapper("POST", '/users/token/', data, this.formSubmitCallback);
    }

    formSubmitCallback (value) {
        console.log("Value",value)
        if ('error' in value) {
            if (value['error'] == 'Bad Request') {
              this.setState({error: 'Wrong Email or Password.'})
            }
            else {
              this.setState({error:value['error']})
            }
        }
        else {
          console.log("User",value);
            localStorage.setItem('token', value['access']);
            localStorage.setItem('refresh_token', value['refresh'])
            localStorage.setItem('token_time', new Date())
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
        var classCss = "form";
        if (this.props.row == true) {
            classCss ="form-row";
        }

        //need to add in formsubmit, delete, and handle change functions to components.
        return(
            <div className={classCss}>
              <FormWithChildren defaults={this.state} autoSetGlobalState={true} setGlobalState={this.setGlobalState} globalStateName={'login'}>
                <TextInput label="Email" placeholder="jeremy@pomodoro.com" name="email" />
                <PasswordInput label="Password" name="password" />
                <Button type='success' text='Log In' onClick={this.formSubmit} name="login"/>
              </FormWithChildren>
                <small className="form-text">Not a user yet? <a href="/signUp/">Sign Up Here</a></small>
                <small className="form-text">Forgot your password? <a href="/passwordResetRequest/">Reset Password</a></small>
                <If logic={this.state.error != ''}>
                  <Alert type='danger' text={this.state.error} />
                </If>
            </div>
        )
    }
}

export default LogInForm;
