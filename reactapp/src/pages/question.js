import React, { Component } from 'react';

import Wrapper from '../base/wrapper.js';
import ajaxWrapper from '../base/ajax.js';

import {Container, Button, Image, Form, TextInput, Navbar, List, Link, Accordion, Paragraph, RadioButton, TextArea, Header, Icon, Alert} from 'library';
import ProjectCard from '../projectLibrary/projectCard.js';
import GradeContainer from '../projectLibrary/GradeContainer.js';

import Swipeable from 'react-swipeable';
import {isMobile} from 'react-device-detect';
import Nav from '../projectLibrary/nav.js';

class Question extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
            question: {id:0,project_id:0,name:'',question_text:'',options:[]},
            answers: [],
            currentIndex:0,
            open:[true,true],
            conflicts:[],
        };

        this.getQuestionData = this.getQuestionData.bind(this);
        this.questionCallback = this.questionCallback.bind(this);
        this.changeCurrentIndex = this.changeCurrentIndex.bind(this);
        this.saveGrade = this.saveGrade.bind(this);
        this.analysesCallback = this.analysesCallback.bind(this);
        this.nextInQueue = this.nextInQueue.bind(this);
        this.questionCallback = this.questionCallback.bind(this);
        this.conflictCheck = this.conflictCheck.bind(this);
        this.getQuestionData();
    }

    setGlobalState() {

    }

    getQuestionData() {
        ajaxWrapper("GET",  "/api/home/analysis/?user=" + this.props.user_id + "&related=answer&answer__question=" + this.props.question_id, {}, this.analysesCallback);
    }

    analysesCallback(value) {
      var answers = []
      for (var index in value) {
        var analysis = value[index]['analysis'];
        var answer = analysis['answer']
        answer['analysis'] = analysis;
        answers.push(answer)
      }
      this.setState({answers:answers}, this.nextInQueue)
    }

    nextInQueue() {
      ajaxWrapper("GET", "/nextInQueue/"+ this.props.question_id + "/" + this.props.user_id + "/", {}, this.questionCallback)
    }


    questionCallback(value) {
        if (value['error']) {
          window.location.href = '/projects/';
        }
        else {
          console.log("Return Value!", value);
          var newState = {}
          var answers = this.state.answers

          newState['loaded'] = true;
          newState['question'] = value['question']
          answers.push(value['answer'])
          newState['answers'] = answers
          newState['currentIndex'] = answers.length - 1
          //onsole.log("Next In Queue Answers", answers, index)
          this.setState(newState);
        }
    }


    saveGrade(data) {
        console.log("Save Grade",data);
        var answers = this.state.answers
        answers[this.state.currentIndex]['analysis'] = data;
        this.setState({'answers':answers}, () => ajaxWrapper('GET','/api/home/answer/' + data.answer_id + '/?related=analyses,analyses__user', {}, this.conflictCheck))
    }

    conflictCheck(result) {
      console.log("Conflict",result)
      var answer_id = result[0]['answer']['id']
      var analyses = result[0]['answer']['analyses']
      if (analyses.length > 1) {
        var match = true;
        var currentScore = '';
        var users = [];
        for (var index in analyses) {
          users.push(analyses[index]['analysis']['user']['email'])
          if (currentScore == '') {
            currentScore = analyses[index]['analysis']['score']
          }
          else {
            if (currentScore != analyses[index]['analysis']['score']) {
              match = false;
            }
          }
        }

        if (match == true) {
          ajaxWrapper('POST', '/api/home/answer/' + answer_id + '/', {'admin_answer':currentScore, 'completed_analyses':analyses.length}, console.log)
        }
        else {
          ajaxWrapper('POST', '/api/home/answer/' + answer_id + '/', {'admin_answer':'', 'completed_analyses':analyses.length, 'analysis_conflict':true}, console.log)
          for (var index in users) {
            ajaxWrapper('POST','/api/email/', {'subject':'A Student Response Is In Conflict', 'text':'One of your answers was in conflict with another anaylst. Resolve it here: http://localhost:8000/conflict/' + answer_id + '/', 'from_email':'jeremy.thiesen1@gmail.com','to_email':users[index]}, console.log)
          }
          var conflicts = this.state.conflicts;
          conflicts.push(answer_id);
          this.setState({'conflicts':conflicts})
        }
      }
      else {
        ajaxWrapper('POST','/api/home/answer/' + answer_id + '/', {'completed_analyses':1}, console.log)
      }
    }

    changeCurrentIndex(value) {
      console.log("Change Current Value",value)
        if (value != 0) {
        var currentIndex = this.state.currentIndex;
        var newValue = currentIndex + value;
        if (newValue > this.state.answers.length - 1) {
            this.nextInQueue();
        }
        else if (newValue > -1) {
            this.setState({currentIndex: newValue, open:[false,true]})
        }
        }

    }

    render() {
        var name = <div><img src='../../static/images/AnexLogo.PNG' height="30" width="30" /><strong>ANEX</strong></div>;
        var questionName = 'Question: ' + this.state.question.name;
        var css = {};
        if (isMobile) {
             var responseName = <div className="container row" style={{'padding':'10px'}}><h4>{'Response: ' + (this.state.currentIndex + 1) + ' / ' + this.state.answers.length}</h4></div>;
             css = {'padding-right':'2px','padding-left':'2px'}
        }
        else {
            var responseName = <div className="container row" style={{'padding':'10px'}}>
              <div className="col-sm-4">
                <h4>{'Response: ' + (this.state.currentIndex + 1) + ' / ' + this.state.answers.length}</h4>
              </div>
            </div>;
        }

        var conflicts = this.state.conflicts;
        if (conflicts.length > 0) {
          var text = []
          text.push(<Paragraph text={"You've got some conflicts that need resolving. Check the following links."} />)
          for (var index in conflicts) {
            text.push(<Link target='_blank' link={'/conflict/' + conflicts[index] + '/'} text={'Conflict on Answer ' + conflicts[index]} />)
          }
          var conflictDiv = <Alert type={'danger'} text={text} />
        }
        else {
          var conflictDiv = <div></div>;
        }

        var paragraphProps = {'text': this.state.question.text}
        var options = this.state.question.options.toString();
        options = options.split(',');
        console.log("Answers",this.state.answers, this.state.currentIndex, this.state.answers[this.state.currentIndex])
        var answer = 0;
        if (this.state.answers.length > 0) {
          answer = 0
          answer = this.state.answers[this.state.currentIndex]['id'];
        }
        console.log("Answer",answer)

        var gradeContainerProps = {'question_name':this.state.question.name,
        'user_short_name':this.props.user_short_name,
        'options': options, 'saveGrade':this.saveGrade,
        'changeCurrentIndex':this.changeCurrentIndex, 'answer':answer, 'userId':this.props.user_id}

        if (this.state.answers.length > 0) {
            if (this.state.answers[this.state.currentIndex]['analysis'] != null) {
                gradeContainerProps['score'] = this.state.answers[this.state.currentIndex]['analysis']['score']
                gradeContainerProps['comment'] = this.state.answers[this.state.currentIndex]['analysis']['comment']
                gradeContainerProps['analysis_id'] = this.state.answers[this.state.currentIndex]['analysis']['id']
            }
            else {
                gradeContainerProps['score'] = '';
                gradeContainerProps['comment'] = '';
                gradeContainerProps['analysis_id'] = undefined;
            }

            gradeContainerProps['student_response'] = this.state.answers[this.state.currentIndex]['response']
            gradeContainerProps['student_id'] = this.state.answers[this.state.currentIndex]['sid']
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
            <Nav token={this.props.user_id} logOut={this.props.logOut} />
            <div className="container" style={css}>
                <Accordion names={[questionName]} open={[true]} ComponentList={[Paragraph]} ComponentProps={[paragraphProps]} />
                {responseName}
                <Swipeable onSwipedRight={() => this.changeCurrentIndex(-1)} onSwipedLeft={() => this.changeCurrentIndex(1)} >
                <GradeContainer {...gradeContainerProps} />
                </Swipeable>
                {conflictDiv}
            </div>
        </div>;



        return (
            <Wrapper loaded={this.state.loaded}  content={content} />
        );
    }
}

export default Question;
