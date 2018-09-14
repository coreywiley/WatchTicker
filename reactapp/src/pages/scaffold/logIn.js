import React, { Component } from 'react';

import Wrapper from 'base/wrapper.js';
import Nav from 'projectLibrary/nav.js';

import {
    Container, Button, Image, TextInput,
    List, Link, Accordion, Paragraph, RadioButton,
    TextArea, Header, LogInForm, PasswordInput
} from 'library';
import Navbar from 'projectLibrary/nav.js';
import Sidebar from 'projectLibrary/loggedOutSidebar.js';

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
        <div className="container" style={{'marginTop':'100px'}}>
                <Header size={2} text={'Log In'} />
                <LogInForm redirectUrl={'/events/'} defaults={['','']} submitUrl={'/users/token/'} components={[TextInput, PasswordInput]} componentProps={[{'value':'','placeholder':'Email', 'name':'email','label':'Email'},{'value':'','placeholder':'Password', 'name':'password'}]} />
        </div>;

        return (
          <div>
          <Sidebar />
          <Wrapper loaded={true} content={content} />
          </div>
        );
    }
}

export default LogIn;
