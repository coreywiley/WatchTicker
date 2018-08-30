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
      var content =
        <div className="container">
            <div className="row">
                <div className="col-md-4"></div>
                <div className="col-md-4"><LogInForm redirectUrl={'/viewer/'} defaults={['','']} submitUrl={'/users/token/'} components={[TextInput, PasswordInput]} componentProps={[{'value':'','placeholder':'Email', 'name':'email','label':'Email'},{'value':'','placeholder':'Password', 'name':'password'}]} /></div>
                <div className="col-md-4"></div>
            </div>
        </div>;

        return (
            <Wrapper loaded={this.state.loaded} content={content} />
        );
    }
}

export default LogIn;
