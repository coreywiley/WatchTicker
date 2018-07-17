import React, { Component } from 'react';
import resolveVariables from '../base/resolver.js';

class PasswordInput extends Component {
    constructor(props) {
        super(props);
        this.state = {password:'',password_confirm:''};
        this.verifyPassword = this.verifyPassword.bind(this);

    }


    verifyPassword = (e) => {

       var name = e.target.getAttribute("name");
       var newState = {};
       newState[name] = e.target.value;
       console.log("handlechange", name, newState)

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
            if (this.state.password != this.state.password_confirm) {
                valid = ' is-invalid';
            }

            passwordConfirm = <div className={"form-group " + this.props.layout}>
                <label>Confirm Password</label>
                <input type="password" className={"form-control" + valid} name="password_confirm" onChange={(e) => {this.verifyPassword(e); this.props.handleChange(e)}} value={this.state.password_confirm} />
                <div className="valid-feedback">
                    Passwords Match!
                  </div>
                <div className="invalid-feedback">
                  Passwords Do Not Match!
                </div>

              </div>
        }

        return (
            <div>
              <div className={"form-group " + this.props.layout}>
                <label>Password</label>
                <input type="password" className="form-control" name="password" onChange={(e) => {this.verifyPassword(e); this.props.handlechange(e)}} value={this.state.password} />
              </div>
              {passwordConfirm}
            </div>
        )


    }
}

export default PasswordInput;
