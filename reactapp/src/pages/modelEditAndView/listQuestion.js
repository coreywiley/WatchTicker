import React, { Component } from 'react';

import Wrapper from 'base/wrapper.js';
import ajaxWrapper from 'base/ajax.js';
import {Container, Button, Image, Form, TextInput, Navbar, List, Link, Accordion, Paragraph, RadioButton, TextArea, Header, Card, MultiLineText} from 'library';

class QuestionList extends Component {
    constructor(props) {
        super(props);
        this.state = {'questions':[]}

        this.objectCallback = this.objectCallback.bind(this);
    }

    componentDidMount() {
      ajaxWrapper('GET','/api/home/question/', {}, this.objectCallback);
    }

    objectCallback(result) {
      var questions = []
      for (var index in result) {
        var question = result[index]['question'];
        questions.push(question)
      }
      this.setState({'questions':questions, 'loaded':true})
    }

    render() {
      console.log("Here");

      var questions = [];
      for (var index in this.state.questions) {
        var question = this.state.questions[index];
        questions.push(<Card name={question.name} description={question.description} button_type={'primary'} button={'View'} link={'/question/' + question.id + '/'} />)
      }

      var content =
        <div className="container">
          <Header size={2} text={'Questions'} />
          <br />
          <Button type={'success'} text={'Add New Question'} href={'/editQuestion/'} />
          <br />
          {questions}
        </div>;

        return (
            <Wrapper loaded={this.state.loaded}  content={content} />
        );
    }
}

export default QuestionList;
