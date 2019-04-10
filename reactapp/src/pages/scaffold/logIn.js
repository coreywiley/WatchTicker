import React, { Component } from 'react';

import {Wrapper} from 'library';

import {
    Container, Button, Image, TextInput,
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
                <div className="col-md-12"><br/><br/></div>
                <div className="col-md-4"></div>
                <div className="col-md-4"><LogInForm redirectUrl={'/viewer/'} /></div>
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
