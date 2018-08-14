import React, { Component } from 'react';

import Wrapper from 'base/wrapper.js';

import {Container, Button, Image, Form, TextInput, Navbar, List, Link, Accordion, Paragraph, RadioButton, TextArea, Header} from 'library';
import ProjectCard from '../projectLibrary/projectCard.js';

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
        var props = {"css":{"text-align":"center"}, "ComponentList":"[Image,Button]", "ComponentProps":[{'src':'./static/images/MathematicsAnex.PNG'}, {'type':'success','text':'Log In'}], "fluid":false};
        var name = <div><img src='./static/images/AnexLogo.PNG' height="30" width="30" /><strong> ANEX</strong></div>;
        var data ={'ComponentList':[Header, Paragraph,Header,RadioButton,Header,TextArea],'ComponentProps':[{'size':4,'text':'Response'},{'text':'22!'},{'size':4,'text':'Analysis'},{'value':'0','name':'grade'},{'size':4,'text':'Comments'},{'name':'comments','value':''}]};
        var content =
        <div>
            <Image src={'./static/images/MathematicsAnex.PNG'} />

            <div className="col-md-4"></div>
            <div className="col-md-4"><Form row={false} defaults={['']} submitUrl={'/api/mathLogin'} components={[TextInput]} componentProps={[{'value':'','placeholder':'Username', 'name':'username'}]} /></div>
            <div className="col-md-4"></div>

        </div>;



        return (
            <Wrapper loaded={this.state.loaded}  content={content} />
        );
    }
}

export default Home;
