import React, { Component } from 'react';

import Wrapper from 'base/wrapper.js';
import ajaxWrapper from 'base/ajax.js';
import {Container, Button, Image, Form, TextInput, Navbar, List, Link, Accordion, Paragraph, RadioButton, TextArea, Header, Card, MultiLineText} from 'library';

class Question extends Component {
    constructor(props) {
        super(props);
        this.state = {'name' : '', 'factoid' : '', 'order' : 'true', 'component' : '', 'props' : ''}

        this.objectCallback = this.objectCallback.bind(this);
    }

    componentDidMount() {
      ajaxWrapper('GET','/api/home/question/' + this.props.question_id + '/', {}, this.objectCallback);
    }

    objectCallback(result) {
      var question = result[0]['question'];
      question['loaded'] = true;
      this.setState(question)
    }

    render() {

			var name = {'text': this.state.name};
			var factoid = {'text': this.state.factoid};
			var order = {'text': this.state.order};
			var component = {'text': this.state.component};
			var props = {'text': this.state.props};
			var ComponentProps = [name, factoid, order, component, props];


      var content =
        <div className="container">
          <Header size={1} text={this.state.name} />
						<Paragraph {...ComponentProps[0]} />
						<MultiLineText {...ComponentProps[1]} />
						<Paragraph {...ComponentProps[2]} />
						<Paragraph {...ComponentProps[3]} />
						<MultiLineText {...ComponentProps[4]} />

        </div>;

        return (
            <Wrapper loaded={this.state.loaded}  content={content} />
        );
    }
}

export default Question;
