import React, { Component } from 'react';

import Wrapper from 'base/wrapper.js';
import Nav from 'projectLibrary/nav.js';

import {
    Container, Button, Image, TextInput,
    List, Link, Accordion, Paragraph, RadioButton,
    TextArea, Header, LogInForm, PasswordInput
} from 'library';
import Navbar from 'projectLibrary/nav.js';

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
          <div>
          <Wrapper loaded={true} content={content} />
          </div>
        );
    }
}

export default LogIn;
