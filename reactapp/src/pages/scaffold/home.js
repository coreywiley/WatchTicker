import React, { Component } from 'react';

import {Wrapper} from 'library';
import MetaTags from 'react-meta-tags';

import {Container, Button, Image, Form, TextInput, Navbar, List, Link, Accordion, Paragraph, RadioButton, TextArea, Header, ChildComponent, ListWithChildren} from 'library';

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
                <h1>Welcome to your task tracker</h1>
                <br/>

                <ListWithChildren dataUrl={'/api/home/task/'} objectName="task" dataMapping={{'text':'{name}'}}>
                  <Paragraph text={'Hi!'} />
                  <Header text={'Hi!'} />
                </ListWithChildren>

                <Button href={'/signUp/'} text={"Sign Up"} type={'success'} />
                <Button href={'/logIn/'} text={"Log In"} type={'outline-success'} />
            </div>
        </div>;

        return (
            <Wrapper token={this.props.user_id} loaded={this.state.loaded}  content={content} />
        );
    }
}

export default Home;
