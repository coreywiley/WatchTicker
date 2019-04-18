import React, { Component } from 'react';
import {resolveVariables} from 'functions';
import {NumberInput, TextInput, Select, CSSInput} from 'library'

var BOOLEANS = [
  {'text':'True', value:true},
  {'text':'False', value:false},
];

class PasswordInput extends Component {

    constructor(props) {
        super(props);
        this.config = {
            form_components: [
                
                <TextInput label={'name'} name={'name'} />,
                <TextInput label={'placeholder'} name={'placeholder'} />,
                <Select label={'Confirm Password?'} name={'confirm_password'} options={BOOLEANS} />,
                <Select label={'required'} name={'required'} options={BOOLEANS} />,
                <TextInput label={'class'} name={'className'} />,
                <CSSInput label={'css'} name={'style'} default={{}} />,
            ],
        }
        
        this.state = {password:'',password_confirm:''};
        this.verifyPassword = this.verifyPassword.bind(this);

    }


    verifyPassword = (e) => {

       var name = e.target.getAttribute("name");
       var newState = {};
       newState[name] = e.target.value;
       console.log("handleChange", name, newState)

        this.setState(newState);
    }

    render() {

        var layout = '';
        if (this.props.layout) {
            layout = this.props.layout;
        }

        var passwordConfirm = <div></div>;
        if (this.props.confirm_password) {
            var valid = ' is-valid';
            if (this.state.password == '') {
              valid = ' is-blank'
              passwordConfirm = <div className={"form-group " + this.props.layout}>
                  <label>Confirm Password</label>
                  <input type="password" className={"form-control" + valid} name="password_confirm" onChange={(e) => this.verifyPassword(e)} value={this.state.password_confirm} />

                </div>
            }

            else if (this.state.password != this.state.password_confirm) {
                valid = ' is-invalid';
                passwordConfirm = <div className={"form-group " + this.props.layout}>
                    <label>Confirm Password</label>
                    <input type="password" className={"form-control" + valid} name="password_confirm" onChange={(e) => this.verifyPassword(e)} value={this.state.password_confirm} />
                    <div className="invalid-feedback">
                      Passwords Do Not Match!
                    </div>
                  </div>
            }

            else {
              passwordConfirm = <div className={"form-group " + this.props.layout}>
                  <label>Confirm Password</label>
                  <input type="password" className={"form-control" + valid} name="password_confirm" onChange={(e) => this.verifyPassword(e)} value={this.state.password_confirm} />
                  <div className="valid-feedback">
                      Passwords Match!
                    </div>
                </div>
            }

        }

        return (
            <div>
              <div className={"form-group " + this.props.layout}>
                <label>Password</label>
                <input type="password" className="form-control" name="password" placeholder={this.props.placeholder} onChange={(e) => {this.verifyPassword(e); this.props.handleChange(e)}} value={this.state.password} />
              </div>
              {passwordConfirm}
            </div>
        )


    }
}

export default PasswordInput;
