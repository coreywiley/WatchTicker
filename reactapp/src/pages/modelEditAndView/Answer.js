import React, { Component } from 'react';

import Wrapper from 'base/wrapper.js';
import ajaxWrapper from 'base/ajax.js';
import {Container, Button, Image, Form, TextInput, Navbar, List, Link, Accordion, Paragraph, RadioButton, TextArea, Header, Card, MultiLineText} from 'library';

class Answer extends Component {
    constructor(props) {
        super(props);
        this.state = {'question' : '', 'answer' : '', 'user' : ''}

        this.objectCallback = this.objectCallback.bind(this);
    }

    componentDidMount() {
      ajaxWrapper('GET','/api/home/answer/' + this.props.answer_id + '/', {}, this.objectCallback);
    }

    objectCallback(result) {
      var answer = result[0]['answer'];
      answer['loaded'] = true;
      this.setState(answer)
    }

    render() {

			var question = {'text': this.state.question};
			var answer = {'text': this.state.answer};
			var user = {'text': this.state.user};
			var ComponentProps = [question, answer, user];


      var content =
        <div className="container">
          <Header size={1} text={this.state.name} />
						<Paragraph {...ComponentProps[0]} />
						<MultiLineText {...ComponentProps[1]} />
						<Paragraph {...ComponentProps[2]} />

        </div>;

        return (
            <Wrapper loaded={this.state.loaded}  content={content} />
        );
    }
}

export default Answer;
