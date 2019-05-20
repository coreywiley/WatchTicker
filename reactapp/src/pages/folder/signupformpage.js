import React, { Component } from 'react';
import {ajaxWrapper, resolveVariables} from 'functions';

import {Wrapper, Container, SignUpForm, Header} from 'library';

class SignUpFormPage extends Component {

    render() {

        return (<div>		<Container style={{}} required={""} className={""} >
			<Container style={{}} required={""} className={"col-4"} >
</Container>
			<Container style={{}} required={""} className={"col-4"} >
				<SignUpForm style={{}} required={""} className={"col-4"} text={"Sign Up"} size={"3"} order={"1"} redirectUrl={"/viewer/"} >
</SignUpForm>
				<Header style={{'width': '200px'}} required={""} className={"col-4"} text={"Sign Up"} size={"3"} order={"0"} >
</Header>
</Container>
			<Container style={{}} required={""} className={"col-4"} >
</Container>
</Container></div>);
    }
}
export default SignUpFormPage;
