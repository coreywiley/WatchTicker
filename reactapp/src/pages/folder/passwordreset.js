import React, { Component } from 'react';
import {ajaxWrapper, resolveVariables} from 'functions';

import {Wrapper, Header, FormWithChildren, PasswordInput} from 'library';

class PasswordReset extends Component {

    render() {

        return (<div className="container">
            <Header text={"Reset Password"} size={2} style={{}} required={""} />
	          <FormWithChildren text={"Reset Password"} size={2} style={{}} required={""} children={[]} submitUrl={"/users/resetPassword/" + this.props.user_id + "/"} confirm_password={"true"} name={"password"} redirectUrl={"/login/"} >
			<PasswordInput text={"Reset Password"} size={2} style={{}} required={"true"} children={[]} confirm_password={"true"} name={"password"} />
            </FormWithChildren>
            </div>);
    }
}

export default PasswordReset;
