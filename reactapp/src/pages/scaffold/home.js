import React, { Component } from 'react';

import Wrapper from 'base/wrapper.js';

import {Container, Button, Image, Form, TextInput, List, Link, Accordion, Paragraph, RadioButton, TextArea, Header} from 'library';
import Navbar from 'projectLibrary/nav.js';

class Home extends Component {
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
        <div>
          <p>Catering Checklist</p>
          <Button href={'/signUp/'} text={"Sign Up"} type={'success'} />
          <Button href={'/logIn/'} text={"Log In"} type={'primary'} />
        </div>;

        return (
          <div>
            <Navbar logged_in={false} />
            <Wrapper loaded={this.state.loaded}  content={content} />
          </div>
        );
    }
}

export default Home;
