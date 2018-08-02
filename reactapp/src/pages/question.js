import React, { Component } from 'react';

import Wrapper from '../base/wrapper.js';
import ajaxWrapper from '../base/ajax.js';

import GradeContainer from '../projectLibrary/GradeContainer.js';
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
import Icon from '../library/icon.js';

import Swipeable from 'react-swipeable';
import {isMobile} from 'react-device-detect';


class Question extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
            question: {id:0,project_id:0,name:'',question_text:'',options:[]},
            responses: [],
            currentIndex:0,
            open:[true,true],
        };

        this.getQuestionData = this.getQuestionData.bind(this);
        this.questionCallback = this.questionCallback.bind(this);
        this.changeCurrentIndex = this.changeCurrentIndex.bind(this);
        this.saveGrade = this.saveGrade.bind(this);
        this.getQuestionData();
    }

    setGlobalState() {

    }

    getQuestionData() {
        ajaxWrapper("GET", "/getQuestion/" + this.props.question_id + "/", {}, this.questionCallback);
    }

    questionCallback(value) {
        console.log("Return Value!", value)
        value['loaded'] = true;
        this.setState(value);
    }

    saveGrade(data) {
        var responses = this.state.responses
        responses[this.state.currentIndex]['grade'] = data;
        this.setState({'responses':responses})
    }

    changeCurrentIndex(value) {
        if (value != 0) {
        var currentIndex = this.state.currentIndex;
        var newValue = currentIndex + value;

        if (newValue > this.state.responses.length - 1) {
            window.location.href = '/projects/';
        }
        if (newValue > -1) {
            this.setState({currentIndex: newValue, open:[false,true]})
        }
        }

    }

    render() {
        var name = <div><img src='../../static/images/AnexLogo.PNG' height="30" width="30" /><strong>ANEX</strong></div>;
        var questionName = 'Question: ' + this.state.question.name;
        var css = {};
        if (isMobile) {
             var responseName = <div className="container row" style={{'padding':'10px'}}><h4>{'Response: ' + (this.state.currentIndex + 1) + ' / ' + this.state.responses.length}</h4></div>;
             css = {'padding-right':'2px','padding-left':'2px'}
        }
        else {
            var responseName = <div className="container row" style={{'padding':'10px'}}><div className="col-sm-1"><Icon size={2} icon={'chevron-left'} onClick={() => this.changeCurrentIndex(-1)} /></div><div className="col-sm-4"><h4>{'Response: ' + (this.state.currentIndex + 1) + ' / ' + this.state.responses.length}</h4></div><div className="col-sm-1"><Icon size={2} icon={'chevron-right'} onClick={() => this.changeCurrentIndex(1)} /></div></div>;
        }


        var paragraphProps = {'text': this.state.question.question_text}

        var gradeContainerProps = {'question_name':this.state.question.name,
        'user_short_name':this.props.user_short_name,
        'options':this.state.question.options, 'saveGrade':this.saveGrade,
        'changeCurrentIndex':this.changeCurrentIndex}

        if (this.state.responses.length > 0) {
            if (this.state.responses[this.state.currentIndex]['grade'] != null) {
                gradeContainerProps['user_score'] = this.state.responses[this.state.currentIndex]['grade']['user_score']
                gradeContainerProps['user_comment'] = this.state.responses[this.state.currentIndex]['grade']['user_comment']
            }
            else {
                gradeContainerProps['user_score'] = '';
                gradeContainerProps['user_comment'] = '';
            }

            gradeContainerProps['student_response'] = this.state.responses[this.state.currentIndex]['response']['student_response']
            gradeContainerProps['student_id'] = this.state.responses[this.state.currentIndex]['response']['student_id']
            gradeContainerProps['key'] = this.state.currentIndex;
        } else {
            gradeContainerProps['user_score'] = '';
            gradeContainerProps['student_response'] = '';
            gradeContainerProps['student_id'] = '';
            gradeContainerProps['user_comment'] = '';
            gradeContainerProps['key'] = 0;
        }

        console.log("Grade Container Props",gradeContainerProps)

        var content =
        <div>
            <NavBar nameLink={'/projects/'} name={name} links={[['#','Analyst: ' + this.props.user_name],['/projects/','Projects']]} logOut={this.props.logOut} />
            <div className="container" style={css}>
                <Accordion names={[questionName]} open={[true]} ComponentList={[Paragraph]} ComponentProps={[paragraphProps]} />
                {responseName}
                <Swipeable onSwipedRight={() => this.changeCurrentIndex(-1)} onSwipedLeft={() => this.changeCurrentIndex(1)} >
                <GradeContainer {...gradeContainerProps} />
                </Swipeable>
            </div>
        </div>;



        return (
            <Wrapper loaded={this.state.loaded}  content={content} />
        );
    }
}

export default Question;
