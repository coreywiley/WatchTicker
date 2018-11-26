import React, { Component } from 'react';

import Wrapper from 'base/wrapper.js';
import ajaxWrapper from 'base/ajax.js';
import {Container, Button, Image, Form, TextInput, Navbar, List, Link, Accordion, Paragraph, RadioButton, TextArea, Header, Card, MultiLineText} from 'library';

class AnswerList extends Component {
    constructor(props) {
        super(props);
        this.state = {'answers':[]}

        this.objectCallback = this.objectCallback.bind(this);
    }

    componentDidMount() {
      ajaxWrapper('GET','/api/home/answer/', {}, this.objectCallback);
    }

    objectCallback(result) {
      var answers = []
      for (var index in result) {
        var answer = result[index]['answer'];
        answers.push(answer)
      }
      this.setState({'answers':answers, 'loaded':true})
    }

    render() {
      console.log("Here");

      var answers = [];
      for (var index in this.state.answers) {
        var answer = this.state.answers[index];
        answers.push(<Card name={answer.name} description={answer.description} button_type={'primary'} button={'View'} link={'/answer/' + answer.id + '/'} />)
      }

      var content =
        <div className="container">
          <Header size={2} text={'Answers'} />
          <br />
          <Button type={'success'} text={'Add New Answer'} href={'/editAnswer/'} />
          <br />
          {answers}
        </div>;

        return (
            <Wrapper loaded={this.state.loaded}  content={content} />
        );
    }
}

export default AnswerList;
