import React, { Component } from 'react';

import Wrapper from '../base/wrapper.js';
import ajaxWrapper from '../base/ajax.js';

import {Container, Button, Image, Form, TextInput, Navbar, List, Link, Accordion, Paragraph, RadioButton, TextArea, Header, Icon, Alert, ButtonGroup} from 'library';
import ProjectCard from '../projectLibrary/projectCard.js';
import GradeContainer from '../projectLibrary/GradeContainer.js';

import Swipeable from 'react-swipeable';
import {isMobile} from 'react-device-detect';
import Nav from '../projectLibrary/nav.js';

class Conflict extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
            question: {id:0,project_id:0,name:'',question_text:'',options:[]},
            answer: {id:0, response:''},
            analyses: [],
            discussions: [],
            open:[true,true],
            conflict_score: '',
        };

        this.conflictCallback = this.conflictCallback.bind(this);
        this.conflictRefresh = this.conflictRefresh.bind(this);
        this.discussionSubmit = this.discussionSubmit.bind(this);
    }


    componentDidMount() {
        this.conflictRefresh();
    }

    conflictRefresh() {
      ajaxWrapper("GET",  "/api/home/answer/157/?analysis_conflict=true&related=analyses,question,discussions,discussions__user,analyses__user", {}, this.conflictCallback);
    }

    conflictCallback(result) {
      var answer = result[0]['answer']
      var question = answer['question']
      var analyses = [];
      var discussions = [];
      var conflict_score = '';
      for (var index in answer['analyses']) {
        var analysis = answer['analyses'][index]['analysis'];
        if (analysis.user.id == parseInt(this.props.user_id)) {
          if (analysis.conflict_score != '') {
            conflict_score = analysis.conflict_score;
          }
        }
        analyses.push(analysis)
      }

      for (var index in answer['discussions']) {
        var discussion = answer['discussions'][index]['discussion'];
        discussions.push(discussion)
      }

      this.setState({answer:answer, question: question, analyses: analyses, discussions:discussions, loaded:true, conflict_score:conflict_score})
    }

    discussionSubmit(value) {
      for (var index in this.state.analyses) {
        if (this.state.analyses[index]['user']['id'] != parseInt(this.props.user_id)) {
          ajaxWrapper('POST','/api/email/', {'to_email':this.state.analyses[index]['user']['email'], 'from_email':'jeremy.thiesen1@gmail.com','subject':'Response To One Of Your Conflicts','text':'Someone responded to one of your conflicts. Please check back here: localhost:8000/conflict/' + this.state.answer.id +'/'}, console.log)
        }
      }
      this.conflictRefresh()
    }

    handleChange = (e) => {

       var name = e.target.getAttribute("name");
       var newState = {};
       newState[name] = e.target.value;
       console.log("handlechange",name,newState)

       var match = undefined;
       var analysis_id = undefined;
       var conflict_score = '';
       for (var index in this.state.analyses) {
         if (this.state.analyses[index]['conflict_score'] != '') {
           if (conflict_score == '') {
             conflict_score = this.state.analyses[index]['conflict_score']
           }
           else {
             if (conflict_score == this.state.analyses[index]['conflict_score']) {
               match = true;
             }
             else {
               match = false;
             }
           }
         }
         if (this.state.analyses[index]['user']['id'] == parseInt(this.props.user_id)) {
           if (conflict_score == '') {
             conflict_score = newState[name]
           }
           else {
             if (conflict_score == newState[name]) {
               match = true;
             }
             else {
               match = false;
             }
           }
           analysis_id = this.state.analyses[index]['id']
         }
       }
       if (analysis_id) {
         ajaxWrapper('POST','/api/home/analysis/' + analysis_id + '/',newState,console.log);
         if (match == true) {
           ajaxWrapper('POST','/api/home/answer/' + this.state.answer['id'] + '/',{'analysis_conflict': false, 'admin_answer':newState[name]},console.log);
         }
         else if (match == false) {
           ajaxWrapper('POST','/api/email/',{'to_email': 'jeremy.thiesen1@gmail.com', 'from_email':'jeremy.thiesen1@gmail.com','subject':'A conflict needs you to resolve it.','text':'Please resolve this conflict: localhost:8000/conflict/' + this.state.answer.id + '/'},console.log);
         }
       }
       else {
         ajaxWrapper('POST','/api/home/answer/' + this.state.answer['id'] + '/',{'admin_answer':newState[name]},console.log);
      }

      this.setState(newState)
    }


    render() {
        var name = <div><img src='../../static/images/AnexLogo.PNG' height="30" width="30" /><strong>ANEX</strong></div>;
        var questionName = 'Question: ' + this.state.question.name;
        var questionText = {'text': this.state.question.text}
        var responseName = 'Response ' + this.state.answer.id;
        var responseText = {'text':this.state.answer.response}

        var analyses = [];
        for (var index in this.state.analyses) {
          var analysis = this.state.analyses[index]
          var first_name = analysis['user']['first_name'];
          console.log("Analysis User", analysis.user_id, "User Id", this.props.user_id)
          if (analysis.user.id == parseInt(this.props.user_id)) {
            first_name = 'You'
          }
          analyses.push(<Paragraph text={first_name + " originally scored the student's response as " + analysis['score']} />)
          if (analysis['conflict_score']) {
            analyses.push(<Paragraph text={"After discussion " + first_name + " scored the student's response as " + analysis['conflict_score']} />)
          }
        }

        var discussions = [];
        if (this.state.discussions.length == 0) {
          discussions.push(<Paragraph text={'No one has responded yet.'} />)
        }
        for (var index in this.state.discussions) {
          var discussion = this.state.discussions[index]
          var first_name = discussion['user']['first_name'];
          if (discussion.user.id == this.props.user_id) {
            first_name = 'You'
          }
          discussions.push(<Paragraph text={first_name + ': ' + discussion['text']} />)
        }

        var discussProps = {'name':'text', 'value':''}
        var defaults = {'text':'', 'answer':this.state.answer.id, 'user':this.props.user_id}
        var submitUrl = '/api/home/discussion/';
        var redirect = this.discussionSubmit;


        var buttonGroupProps = {'handlechange':this.handleChange, 'options':this.state.question.options.toString().split(','),'name':'conflict_score', 'type':'primary', 'value':this.state.conflict_score}

        var content =
        <div>
            <Nav token={this.props.user_id} logOut={this.props.logOut} />
            <div className="container">
                <Accordion names={[questionName, responseName]} open={[true,true]} ComponentList={[Paragraph, Paragraph]} ComponentProps={[questionText, responseText]} multiple={true} />
                {analyses}
                <Header size={2} text={'Discussion'} />
                {discussions}
                <Header size={4} text={'Respond'} />
                <Paragraph text={'Start by explaing why you scored the way you did. Try and work toward a agreement, but if you think you are right. Stick to your guns and answer the way you believe.'} />
                <Form components={[TextArea]} first={true} componentProps={[discussProps]} submitUrl={submitUrl} defaults={defaults} redirect={redirect}/>
                <Header size={4} text={'Response Score After Discussion'} />
                <ButtonGroup {...buttonGroupProps} />
            </div>
        </div>;



        return (
            <Wrapper loaded={this.state.loaded}  content={content} />
        );
    }
}

export default Conflict;
