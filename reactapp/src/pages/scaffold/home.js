import React, { Component } from 'react';

import Wrapper from 'base/wrapper.js';
import MetaTags from 'react-meta-tags';

import {Container, Button, Image, Form, TextInput, Navbar, List, Link, Accordion, Paragraph, RadioButton, TextArea, Header} from 'library';

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
        <div className='container'>
            <br/><br/>
            <div style={{textAlign:"center"}}>
                <h1>Welcome to your new project</h1>
                <br/>

                <Button href={'/signUp/'} text={"Sign Up"} type={'success'} />
            </div>
        </div>;

        return (
            <Wrapper token={this.props.user_id} loaded={this.state.loaded}  content={content} />
        );
    }
}

export default Home;
