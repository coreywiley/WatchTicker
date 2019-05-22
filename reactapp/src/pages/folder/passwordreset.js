import React, { Component } from 'react';
import {ajaxWrapper, resolveVariables} from 'functions';

import {Wrapper, Header, FormWithChildren, PasswordInput} from 'library';

class PasswordReset extends Component {

    render() {

        return (<div className="container">		<Header text={"Reset Password"} size={2} style={{}} required={""} >
</Header>
		<FormWithChildren text={"Reset Password"} size={2} style={{}} required={""} children={[]} submitUrl={resolveVariables({"text":"/users/resetPassword/{params.1}/"}, window.cmState.getGlobalState(this))["text"]} confirm_password={"true"} name={"password"} redirectUrl={"/login/"} >
			<PasswordInput text={"Reset Password"} size={2} style={{}} required={"true"} children={[]} submitUrl={resolveVariables({"text":"/users/resetPassword/{user.id}/"}, window.cmState.getGlobalState(this))["text"]} confirm_password={"true"} name={"password"} >
</PasswordInput>
</FormWithChildren></div>);
    }
}
export default PasswordReset;
