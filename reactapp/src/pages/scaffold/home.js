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
        <div style={{'text-align':'center','margin-top':'200px'}}>
          <p><img src='/static/images/CaterListerTagLine.JPG' /></p>
          <Button href={'/signUp/'} text={"Sign Up"} type={'success'} css={{'margin':'20px'}}/>
          <Button href={'/logIn/'} text={"Log In"} type={'primary'} css={{'margin':'20px'}}/>
        </div>;

        return (
          <div>
            <Wrapper loaded={this.state.loaded}  content={content} />
          </div>
        );
    }
}

export default Home;
