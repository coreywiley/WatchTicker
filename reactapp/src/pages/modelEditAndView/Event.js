
import React, { Component } from 'react';

import Wrapper from 'base/wrapper.js';
import ajaxWrapper from 'base/ajax.js';
import {Container, Button, Image, Form, TextInput, Navbar, List, Link, Accordion, Paragraph, RadioButton, TextArea, Header, Card, MultiLineText} from 'library';

class Event extends Component {
    constructor(props) {
        super(props);
        this.state = {'host' : '', 'name' : '', 'description' : '', 'schedule_start_time' : '', 'length' : '30', 'holidays' : 'false'}

        this.objectCallback = this.objectCallback.bind(this);
    }

    componentDidMount() {
      ajaxWrapper('GET','/api/home/event/' + this.props.event_id + '/', {}, this.objectCallback);
    }

    objectCallback(result) {
      var event = result[0]['event'];
      event['loaded'] = true;
      this.setState(event)
    }

    render() {

			var host = {'text': this.state.host};
			var name = {'text': this.state.name};
			var description = {'text': this.state.description};
			var schedule_start_time = {'text': this.state.schedule_start_time};
			var length = {'text': this.state.length};
			var holidays = {'text': this.state.holidays};
			var ComponentProps = [host, name, description, schedule_start_time, length, holidays];


      var content =
        <div className="container">
          <Header size={1} text={this.state.name} />
						<Paragraph {...ComponentProps[0]} />
						<Paragraph {...ComponentProps[1]} />
						<MultiLineText {...ComponentProps[2]} />
						<Paragraph {...ComponentProps[3]} />
						<Paragraph {...ComponentProps[4]} />
						<Paragraph {...ComponentProps[5]} />

        </div>;

        return (
            <Wrapper loaded={this.state.loaded}  content={content} />
        );
    }
}

export default Event;
