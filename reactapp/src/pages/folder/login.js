import React, { Component } from 'react';
import {ajaxWrapper, resolveVariables} from 'functions';

import {Wrapper, Container, LogInForm, Header} from 'library';

class LogIn extends Component {

    render() {

        return (<div>
        <Container style={{}} required={""} className={""} redirectUrl={"/viewer/"} >
			<Container style={{}} required={""} className={"col-4"} />
			<Container style={{'margin-top': '20px'}} required={""} className={"col-4"} redirectUrl={"/viewer/"} >
                <Header text={"Log In"} size={2} style={{}} required={""} order={"0"} parent={"2"} />
				<LogInForm redirectUrl={"/viewer/"} style={{}} required={""} order={"1"} parent={"2"} />
            </Container>
			<Container style={{}} required={""} className={"col-4"} />
        </Container>
    </div>);
    }
}
export default LogIn;
