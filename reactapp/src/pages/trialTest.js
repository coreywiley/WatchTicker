import React, { Component } from 'react';

import Wrapper from '../base/wrapper.js';
import ajaxWrapper from '../base/ajax.js';

import {Container, Button, Image, Form, TextInput, Navbar, List, Link, Accordion, Paragraph, RadioButton, TextArea, Header, Icon, Table} from 'library';
import {isMobile} from 'react-device-detect';
import Nav from '../projectLibrary/nav.js';

class TrialTest extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: true,
            question: {id:0,project_id:0,name:'',question_text:'',options:[]},
        };

    }

    setGlobalState() {

    }


    render() {
        var name = <div><img src='../../static/images/AnexLogo.PNG' height="30" width="30" /><strong>ANEX</strong></div>;
        var message = "Welcome to your calibration test. You've just practiced on 10 questions with feedback. From here on out, you will no longer be given feedback after your answer. Your goal is to analyze 7/10 student responses in the same way as you have been. If you get 7/10, you pass and can start analyzing real student responses. Good luck!"
        var content =
        <div>
            <Nav token={this.props.user_id} logOut={this.props.logOut} />
            <div className="container">
                <Header size={'2'} text={'Your Calibration Test'} />
                <Paragraph text={message} />
                <Button type='success' text={'Start Analyzing'} href={'/trialQuestion/' + this.props.question_id +'/'} />

            </div>
        </div>;

        return (
            <Wrapper loaded={this.state.loaded}  content={content} />
        );
    }
}

export default TrialTest;
