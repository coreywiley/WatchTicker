import React, { Component } from 'react';
import {ajaxWrapper, resolveVariables} from 'functions';

import {Wrapper, Container, LogInForm, Header} from 'library';
import {
  BrowserView,
  MobileView,
  isBrowser,
  isMobile
} from "react-device-detect";

class LogIn extends Component {

    render() {

        return (<div>
        <Container style={{}} required={""} className={""} redirectUrl={"/viewer/"} >
        <BrowserView>
			<Container style={{}} required={""} className={"col-4"} />
			<Container style={{'margin-top': '20px'}} required={""} className={"col-4"} >
                <Header text={"Log In"} size={2} style={{}} required={""} order={"0"} parent={"2"} />
				<LogInForm redirectUrl={"/watches/"} style={{}} required={""} order={"1"} parent={"2"} />
            </Container>
			<Container style={{}} required={""} className={"col-4"} />
        </BrowserView>
        <MobileView>
        <Container style={{'margin-top': '20px'}} required={""} >
            <Header text={"Log In"} size={2} style={{}} required={""} order={"0"} parent={"2"} />
            <LogInForm redirectUrl={"/watches/"} style={{}} required={""} order={"1"} parent={"2"} />
        </Container>
        </MobileView>
        </Container>
    </div>);
    }
}
export default LogIn;
