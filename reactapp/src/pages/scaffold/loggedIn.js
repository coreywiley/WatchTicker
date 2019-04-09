import React, { Component } from 'react';

import {Wrapper} from 'library';
import {ajaxWrapper} from 'functions';
import {Container, Button, Image, Form, TextInput, Navbar, List, Link, Accordion, Paragraph, RadioButton, TextArea, Header} from 'library';

class LoggedIn extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: true
        };
    }

    componentDidMount() {

    }

    setGlobalState() {

    }

    render() {
      var content =
        <div>
          <p>Welcome To The Logged In Area!</p>
          <Button clickHandler={this.props.logOut} text={"Log Out"} type={'danger'} />
        </div>;



        return (
            <Wrapper loaded={this.state.loaded}  content={content} />
        );
    }
}

export default LoggedIn;
