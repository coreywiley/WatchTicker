import React, { Component } from 'react';

import Wrapper from 'base/wrapper.js';
import Nav from 'projectLibrary/loggedOutNav.js';

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

                <LogInForm redirectUrl={'/dashboard/'} defaults={['','']} submitUrl={'/users/authenticate-user/'} components={[TextInput, PasswordInput]} componentProps={[{'value':'','placeholder':'Email', 'name':'email','label':'Email'},{'value':'','placeholder':'Password', 'name':'password'}]} />

            </div>

        </div>;



        return (
          <div>
          <Nav />
          <Wrapper loaded={true} content={content} />
          </div>
        );
    }
}

export default LogIn;
