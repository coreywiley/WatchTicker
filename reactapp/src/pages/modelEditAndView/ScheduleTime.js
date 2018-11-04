
import React, { Component } from 'react';

import Wrapper from 'base/wrapper.js';
import ajaxWrapper from 'base/ajax.js';
import {Container, Button, Image, Form, TextInput, Navbar, List, Link, Accordion, Paragraph, RadioButton, TextArea, Header, Card, MultiLineText} from 'library';

class Scheduletime extends Component {
    constructor(props) {
        super(props);
        this.state = {'start_time' : '', 'end_time' : '', 'available' : 'false', 'repeat_monday' : 'false', 'repeat_tuesday' : 'false', 'repeat_wednesday' : 'false', 'repeat_thursday' : 'false', 'repeat_friday' : 'false', 'repeat_saturday' : 'false', 'repeat_sunday' : 'false', 'user' : '', 'event' : ''}

        this.objectCallback = this.objectCallback.bind(this);
    }

    componentDidMount() {
      ajaxWrapper('GET','/api/home/scheduletime/' + this.props.scheduletime_id + '/', {}, this.objectCallback);
    }

    objectCallback(result) {
      var scheduletime = result[0]['scheduletime'];
      scheduletime['loaded'] = true;
      this.setState(scheduletime)
    }

    render() {

			var start_time = {'text': this.state.start_time};
			var end_time = {'text': this.state.end_time};
			var available = {'text': this.state.available};
			var repeat_monday = {'text': this.state.repeat_monday};
			var repeat_tuesday = {'text': this.state.repeat_tuesday};
			var repeat_wednesday = {'text': this.state.repeat_wednesday};
			var repeat_thursday = {'text': this.state.repeat_thursday};
			var repeat_friday = {'text': this.state.repeat_friday};
			var repeat_saturday = {'text': this.state.repeat_saturday};
			var repeat_sunday = {'text': this.state.repeat_sunday};
			var user = {'text': this.state.user};
			var event = {'text': this.state.event};
			var ComponentProps = [start_time, end_time, available, repeat_monday, repeat_tuesday, repeat_wednesday, repeat_thursday, repeat_friday, repeat_saturday, repeat_sunday, user, event];


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
						<Paragraph {...ComponentProps[7]} />
						<Paragraph {...ComponentProps[8]} />
						<Paragraph {...ComponentProps[9]} />
						<Paragraph {...ComponentProps[10]} />
						<Paragraph {...ComponentProps[11]} />

        </div>;

        return (
            <Wrapper loaded={this.state.loaded}  content={content} />
        );
    }
}

export default Scheduletime;
