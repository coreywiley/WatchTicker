import React, { Component } from 'react';

import Wrapper from '../base/wrapper.js';

import Container from '../library/container.js';
import Button from '../library/button.js';
import Image from '../library/image.js';
import Form from '../library/form.js';
import TextInput from '../library/textinput.js';
import NavBar from '../library/navbar.js';
import List from '../library/list.js';
import Link from '../library/link.js';
import Accordion from '../library/accordion.js';
import Paragraph from '../library/paragraph.js';
import RadioButton from '../library/radiobutton.js';
import TextArea from '../library/textarea.js';
import Header from '../library/header.js';
import ProjectCard from '../projectLibrary/projectCard.js';

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
        var props = {"css":{"text-align":"center"}, "ComponentList":"[Image,Button]", "ComponentProps":[{'src':'./static/images/MathematicsAnex.PNG'}, {'type':'success','text':'Log In'}], "fluid":false};
        var name = <div><img src='../static/images/AnexLogo.PNG' height="30" width="30" /><strong>ANEX</strong></div>;
        var data ={'ComponentList':[Header, Paragraph,Header,RadioButton,Header,TextArea],'ComponentProps':[{'size':4,'text':'Response'},{'text':'22!'},{'size':4,'text':'Analysis'},{'value':'0','name':'grade'},{'size':4,'text':'Comments'},{'name':'comments','value':''}]};
        var title = <Header size={2} text={'Current Projects:'} />
        var content =
        <div>
            <NavBar nameLink={'/projects/'} name={name} links={[['#','Analyst: ' + this.props.user_name]]} logOut={this.props.logOut} />
            <div className="container">
                <List component={ProjectCard} title={title} setGlobalState={this.setGlobalState} objectName={'project'} dataUrl={'/getProjects/'} dataMapping={{'id':'{id}','responses': '{totalResponse}', 'grades':'{totalGrades}', 'description':'{totalGrades}/{totalResponse}','name':'{name}', 'link':'/test/{id}/', 'button_type':'primary', 'button':'Start Analyzing'}} />
            </div>
        </div>;

        return (
            <Wrapper loaded={this.state.loaded}  content={content} />
        );
    }
}

export default Projects;
