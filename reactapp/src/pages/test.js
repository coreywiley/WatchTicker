import React, { Component } from 'react';

import Wrapper from '../base/wrapper.js';
import {Container, Button, Image, Form, TextInput, Navbar, List, Link, Accordion, Paragraph, RadioButton, TextArea, Header} from 'library';
import ProjectCard from '../projectLibrary/projectCard.js';
import Nav from '../projectLibrary/nav.js';

class Test extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: true
        };
    }

    setGlobalState() {

    }

    render() {
        var props = {"css":{"text-align":"center"}, "ComponentList":"[Image,Button]", "ComponentProps":[{'src':'./static/images/MathematicsAnex.PNG'}, {'type':'success','text':'Log In'}], "fluid":false};
        var name = <div><img src='../../static/images/AnexLogo.PNG' height="30" width="30" /><strong>ANEX</strong></div>;
        var data ={'ComponentList':[Header, Paragraph,Header,RadioButton,Header,TextArea],'ComponentProps':[{'size':4,'text':'Response'},{'text':'22!'},{'size':4,'text':'Grade'},{'value':'0','name':'grade'},{'size':4,'text':'Comments'},{'name':'comments','value':''}]};
        var title = <Header size={2} text={'Questions:'} />
        var link = '/question/{id}/'
        if (this.props.project_id == 10) {
          link = '/referenceGuide/{id}/';
        }
        var content =
        <div>
            <Nav token={this.props.user_id} logOut={this.props.logOut} />
            <div className="container">
                <List component={ProjectCard} title={title} setGlobalState={this.setGlobalState} objectName={'question'} dataUrl={'/api/home/question/?test=' + this.props.project_id} dataMapping={{'id':'{id}','progress':true, 'responses': 'None', 'grades':'None', 'description':'{text}','name':'{name}', 'question_id':'{id}', 'link':link, 'conflict_link':'/conflicts/{id}/', 'button_type':'primary', 'button':'Start Analyzing'}} />
            </div>
        </div>;

        return (
            <Wrapper loaded={this.state.loaded}  content={content} />
        );
    }
}

export default Test;
