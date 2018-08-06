import React, { Component } from 'react';

import Wrapper from 'base/wrapper.js';

import {
    Container, Button, Image, TextInput, NavBar,
    List, Link, Accordion, Paragraph, RadioButton,
    TextArea, Header, LogInForm, PasswordInput
} from 'library';


class LogIn extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: true
        };
    }

    setGlobalState() {

    }

    render() {
        var textProps = {'value':'','placeholder':'Email', 'name':'email', 'label':'Email'}
        var passwordProps = {}

        var content =
        <div className="container">

            <div className="row">
                <div className="col-md-2"></div>
                <div className="col-md-8"><h2>Log In</h2><LogInForm row={false} redirectUrl={'/myCrashPads/'} defaults={['']} submitUrl={'/users/logIn/'} components={[TextInput, PasswordInput]} componentProps={[textProps, passwordProps]} /></div>
                <div className="col-md-2"></div>
            </div>
        </div>;

        return (
            <Wrapper loaded={this.state.loaded}  content={content} />
        );
    }
}

export default LogIn;
