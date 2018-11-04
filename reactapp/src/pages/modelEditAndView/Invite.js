
import React, { Component } from 'react';

import Wrapper from 'base/wrapper.js';
import ajaxWrapper from 'base/ajax.js';
import {Container, Button, Image, Form, TextInput, Navbar, List, Link, Accordion, Paragraph, RadioButton, TextArea, Header, Card, MultiLineText} from 'library';

class Invite extends Component {
    constructor(props) {
        super(props);
        this.state = {'event' : '', 'user' : '', 'going' : 'false', 'want_to_go' : 'false', 'read' : 'false', 'required' : 'false', 'last_interaction' : '10/31/2018'}

        this.objectCallback = this.objectCallback.bind(this);
    }

    componentDidMount() {
      ajaxWrapper('GET','/api/home/invite/' + this.props.invite_id + '/', {}, this.objectCallback);
    }

    objectCallback(result) {
      var invite = result[0]['invite'];
      invite['loaded'] = true;
      this.setState(invite)
    }

    render() {

			var event = {'text': this.state.event};
			var user = {'text': this.state.user};
			var going = {'text': this.state.going};
			var want_to_go = {'text': this.state.want_to_go};
			var read = {'text': this.state.read};
			var required = {'text': this.state.required};
			var last_interaction = {'text': this.state.last_interaction};
			var ComponentProps = [event, user, going, want_to_go, read, required, last_interaction];


      var content =
        <div className="container">
          <Header size={1} text={this.state.name} />
						<Paragraph {...ComponentProps[0]} />
						<Paragraph {...ComponentProps[1]} />
						<Paragraph {...ComponentProps[2]} />
						<Paragraph {...ComponentProps[3]} />
						<Paragraph {...ComponentProps[4]} />
						<Paragraph {...ComponentProps[5]} />
						<Paragraph {...ComponentProps[6]} />

        </div>;

        return (
            <Wrapper loaded={this.state.loaded}  content={content} />
        );
    }
}

export default Invite;
