import React, { Component } from 'react';
import {ajaxWrapper, resolveVariables} from 'functions';

import {Wrapper, Container, SignUpForm, Header} from 'library';

class SignUpForm_Page extends Component {

    render() {

        return (<div>		<Container children={[]} style={{}} required={""} className={""} >
			<Container children={[]} style={{}} required={""} className={"col-4"} >
</Container>
			<Container children={[]} style={{}} required={""} className={"col-4"} >
				<SignUpForm children={[]} style={{}} required={""} className={"col-4"} text={"Sign Up"} size={"3"} order={"1"} redirectUrl={"/viewer/"} >
</SignUpForm>
				<Header children={[]} style={{'width': '200px'}} required={""} className={"col-4"} text={"Sign Up"} size={"3"} order={"0"} >
</Header>
</Container>
			<Container children={[]} style={{}} required={""} className={"col-4"} >
</Container>
</Container></div>);
    }
}
export default SignUpForm_Page;
