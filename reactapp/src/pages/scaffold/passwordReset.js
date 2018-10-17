import React, { Component } from 'react';
import ajaxWrapper from "base/ajax.js";
import Wrapper from 'base/wrapper.js';

import {Form, TextInput, Select, PasswordInput} from 'library';
import Navbar from 'projectLibrary/nav.js';

class PasswordReset extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        var Components = [PasswordInput];
        var password_props = {'confirm_password':true};

        var ComponentProps = [password_props];
        var defaults = {'password':''};

        var submitUrl = "/api/user/user/" + this.props.user_id + "/";

        var content = <div className="container">
                <h2>Reset Password</h2>
                <Form components={Components} redirectUrl={'/login/'} componentProps={ComponentProps} submitUrl={submitUrl} defaults={defaults} />
        </div>;


        return (
          <div>
            <Navbar is_staff={this.props.is_staff} logged_in={false} />
            <Wrapper loaded={this.state.loaded}  content={content} />
          </div>
             );
    }
}

export default PasswordReset;
