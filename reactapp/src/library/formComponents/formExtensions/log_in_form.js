import React, { Component } from 'react';
import resolveVariables from 'base/resolver.js';
import ajaxWrapper from "base/ajax.js";

class LogInForm extends Component {
    constructor(props) {
        super(props);
        this.state = {email:'',error:''};

        this.handleChange = this.handleChange.bind(this);
        this.formSubmit = this.formSubmit.bind(this);
        this.formSubmitCallback = this.formSubmitCallback.bind(this);

    }

    handleChange = (e) => {

       var name = e.target.getAttribute("name");
       var newState = {};
       newState[name] = e.target.value;
       console.log("handlechange",name,newState)
        this.setState(newState);
    }


    formSubmit() {
        console.log("Submitting", this.state, this.props.submitUrl);
        var data = this.state;
        data['email'] = data['email'].toLowerCase()
        ajaxWrapper("POST",this.props.submitUrl, data, this.formSubmitCallback);
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

        let components = [];
        console.log("Component Info", this.props.components, this.props.componentProps);
        for (var index in this.props.components) {
            var Component = this.props.components[index];
            var props = this.props.componentProps[index];
            components.push(<Component {...props} handlechange={this.handleChange} value={this.state[props['name']]} />)
        }

        var buttons = [];
        var submitButton = <button style={{'width':'100%'}} className="btn btn-success" onClick={this.formSubmit}>Log In</button>
        buttons.push(submitButton);

        var error = <div></div>
        if (this.state.error != '') {
            error = <div className="alert alert-danger" role="alert">
                          {this.state.error}
                        </div>
        }
        //need to add in formsubmit, delete, and handle change functions to components.
        return(
            <div className={classCss}>
                {components}
                {buttons}
                <small className="form-text">Not a user yet? <a href="/signUp/">Sign Up Here</a></small>
                <small className="form-text">Forgot your password? <a href="/passwordResetRequest/">Reset Password</a></small>
                {error}
            </div>
        )
    }
}

export default LogInForm;
