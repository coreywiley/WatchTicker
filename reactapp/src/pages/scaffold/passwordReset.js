import React, { Component } from 'react';
import {ajaxWrapper} from 'functions';
import {Wrapper} from 'library';

import {FormWithChildren, TextInput, Select, PasswordInput} from 'library';

class PasswordReset extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        var defaults = {'password':''};

        var submitUrl = "/users/resetPassword/" + this.props.user_id + "/";

        var content = <div className="container">
                <h2>Reset Password</h2>
                <FormWithChildren redirectUrl={'/login/'} submitUrl={submitUrl} defaults={defaults}>
                    <PasswordInput confirm_password={true} />
                </FormWithChildren>
        </div>;


        return (
            <Wrapper loaded={true}  content={content} />
         );
    }
}

export default PasswordReset;
