
import React, { Component } from 'react';

import Wrapper from 'base/wrapper.js';
import ajaxWrapper from 'base/ajax.js';
import {Container, Button, Image, Form, TextInput, Navbar, List, Link, Accordion, Paragraph, RadioButton, TextArea, Header, Card, MultiLineText} from 'library';

class EventList extends Component {
    constructor(props) {
        super(props);
        this.state = {'events':[]}

        this.objectCallback = this.objectCallback.bind(this);
    }

    componentDidMount() {
      ajaxWrapper('GET','/api/home/event/', {}, this.objectCallback);
    }

    objectCallback(result) {
      var events = []
      for (var index in result) {
        var event = result[index]['event'];
        events.push(event)
      }
      this.setState({'events':events, 'loaded':true})
    }

    render() {
      console.log("Here");
      
      var events = [];
      for (var index in this.state.events) {
        var event = this.state.events[index];
        events.push(<Card name={event.name} description={event.description} button_type={'primary'} button={'View'} link={'/event/' + event.id + '/'} />)
      }

      var content =
        <div className="container">
          <Header size={2} text={'Events'} />
          <Button type={'success'} text={'Add New Event'} href={'/editEvent/'} />
          {events}
        </div>;

        return (
            <Wrapper loaded={this.state.loaded}  content={content} />
        );
    }
}

export default EventList;
