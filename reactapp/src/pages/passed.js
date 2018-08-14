import React, { Component } from 'react';

import Wrapper from '../base/wrapper.js';
import ajaxWrapper from '../base/ajax.js';

import {Container, Button, Image, Form, TextInput, Navbar, List, Link, Accordion, Paragraph, RadioButton, TextArea, Header, Icon, Table} from 'library';
import {isMobile} from 'react-device-detect';
import Nav from '../projectLibrary/nav.js';

class Passed extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
            question: {id:0,project_id:0,name:'',question_text:'',options:[]},
            question_name:'',
            user_name:'',
            user_email:'',
        };

        this.getUser = this.getUser.bind(this);
        this.questionData = this.questionData.bind(this);
        this.getQuestion = this.getQuestion.bind(this);
    }

    componentDidMount() {
      ajaxWrapper("GET",'/api/user/user/' + this.props.user_id + '/',{}, this.getUser)

    }

    getUser(result) {
      var user_name = result[0]['user']['first_name'] + ' ' + result[0]['user']['last_name']
      var user_email = result[0]['user']['email']
      this.setState({user_name: user_name, user_email: user_email}, this.questionData)
    }

    questionData() {
      ajaxWrapper("GET",'/api/home/question/' + this.props.question_id + '/',{}, this.getQuestion)
    }

    getQuestion(result) {
      var question_name = result[0]['question']['name']
      var text = this.state.user_name + ' Passed their calibration test on item: ' + question_name + '. Congratulate them at ' + this.state.user_email
      ajaxWrapper("POST", '/api/email/',{'to_email':'jeremy.thiesen1@gmail.com', 'from_email':'jeremy.thiesen1@gmail.com', 'text': text, 'subject':'Calibration Passed'}, console.log)
      this.setState({question_name: question_name, loaded: true})
    }

    render() {
        var name = <div><img src='../../static/images/AnexLogo.PNG' height="30" width="30" /><strong>ANEX</strong></div>;
        var message = "You passed! You'll now be able to work with real student responses. An email has been sent to the administrators and they will follow up with you for next steps."
        var content =
        <div>
            <Nav token={this.props.user_id} logOut={this.props.logOut} />
            <div className="container">
                <Header size={'2'} text={'Congratulations'} />
                <Paragraph text={message} />
                <Button type='success' text={'Home'} href={'/projects/'} />

            </div>
        </div>;

        return (
            <Wrapper loaded={this.state.loaded}  content={content} />
        );
    }
}

export default Passed;
