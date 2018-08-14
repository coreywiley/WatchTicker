import React, { Component } from 'react';

import Wrapper from '../base/wrapper.js';
import ajaxWrapper from '../base/ajax.js';

import {Container, Button, Image, Form, TextInput, Navbar, List, Link, Accordion, Paragraph, RadioButton, TextArea, Header, Icon} from 'library';
import {isMobile} from 'react-device-detect';
import Nav from '../projectLibrary/nav.js';

class AnswerQuestion extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
            question: {id:0,project_id:0,name:'',question_text:'',options:[]},
        };

        this.getQuestionData = this.getQuestionData.bind(this);
        this.questionCallback = this.questionCallback.bind(this);
        this.getQuestionData();
    }

    setGlobalState() {

    }

    getQuestionData() {
        ajaxWrapper("GET",  "/api/home/question/" + this.props.question_id + "/", {}, this.questionCallback);
    }

    questionCallback(value) {
        if (value['error']) {
          window.location.href = '/projects/';
        }
        else {
          console.log("Return Value!", value);
          this.setState({question:value[0]['question'], loaded:true});
        }
    }

    render() {

        var questionName = 'Question: ' + this.state.question.name;
        var css = {};
        var answerProps = {'name':'response', 'value':''}
        var defaults = {'response':'', 'question':this.props.question_id, 'sid':this.props.user_id}
        var submitUrl = '/api/home/answer/';
        var redirectUrl = '/referenceGuide/' + this.props.question_id + '/';

        var content =
        <div>
            <Nav token={this.props.user_id} logOut={this.props.logOut} />
            <div className="container" style={css}>
                <Header size={'2'} text={questionName} />
                <Paragraph text={this.state.question.text} />
                <Header size={'4'} text={'Answer Below To Continue'} />
                <Form components={[TextArea]} first={true} componentProps={[answerProps]} submitUrl={submitUrl} defaults={defaults} redirectUrl={redirectUrl}/>
            </div>
        </div>;

        return (
            <Wrapper loaded={this.state.loaded}  content={content} />
        );
    }
}

export default AnswerQuestion;
