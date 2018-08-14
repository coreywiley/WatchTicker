import React, { Component } from 'react';

import Wrapper from '../base/wrapper.js';
import {Container, Button, Image, Form, TextInput, Navbar, List, Link, Accordion, Paragraph, RadioButton, TextArea, Header} from 'library';
import ProjectCard from '../projectLibrary/projectCard.js';
import Nav from '../projectLibrary/nav.js';

class Projects extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: true
        };
    }

    setGlobalState() {

    }

    render() {
        var name = <div><img src='../static/images/AnexLogo.PNG' height="30" width="30" /><strong>ANEX</strong></div>;
        var title = <Header size={2} text={'Current Projects:'} />
        var content =
        <div>
            <Nav token={this.props.user_id} logOut={this.props.logOut} />
            <div className="container">
                <List component={ProjectCard} title={title} setGlobalState={this.setGlobalState} objectName={'test'} dataUrl={'/api/home/test/?related=questions,questions__answers,questions__answers__analyses&completed=false&users=' + this.props.user_id} dataMapping={{'id':'{id}','progress':false, 'description':'','name':'{name}', 'link':'/test/{id}/', 'button_type':'primary', 'button':'Start Analyzing'}} />
            </div>
        </div>;

        return (
            <Wrapper loaded={this.state.loaded}  content={content} />
        );
    }
}

export default Projects;
