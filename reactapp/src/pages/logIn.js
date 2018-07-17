import React, { Component } from 'react';

import Wrapper from '../base/wrapper.js';

import Container from '../library/container.js';
import Button from '../library/button.js';
import Image from '../library/image.js';
import TextInput from '../library/textinput.js';
import NavBar from '../library/navbar.js';
import List from '../library/list.js';
import Link from '../library/link.js';
import Accordion from '../library/accordion.js';
import Paragraph from '../library/paragraph.js';
import RadioButton from '../library/radiobutton.js';
import TextArea from '../library/textarea.js';
import Header from '../library/header.js';
import LogInForm from '../library/log_in_form.js';
import PasswordInput from '../library/passwordinput.js';

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
