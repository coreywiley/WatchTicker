import React, { Component } from 'react';

import Wrapper from 'base/wrapper.js';
import ajaxWrapper from 'base/ajax.js';
import {Container, Button, Image, Form, TextInput, Navbar, List, Link, Accordion, Paragraph, RadioButton, TextArea, Header, Card, MultiLineText} from 'library';

class Component extends Component {
    constructor(props) {
        super(props);
        this.state = {'component' : '', 'props' : '', 'question' : ''}

        this.objectCallback = this.objectCallback.bind(this);
    }

    componentDidMount() {
      ajaxWrapper('GET','/api/home/component/' + this.props.component_id + '/', {}, this.objectCallback);
    }

    objectCallback(result) {
      var component = result[0]['component'];
      component['loaded'] = true;
      this.setState(component)
    }

    render() {

			var component = {'text': this.state.component};
			var props = {'text': this.state.props};
			var question = {'text': this.state.question};
			var ComponentProps = [component, props, question];


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

export default Component;
