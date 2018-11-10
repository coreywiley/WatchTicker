import React, { Component } from 'react';

import Wrapper from 'base/wrapper.js';
import ajaxWrapper from 'base/ajax.js';
import {Container, Button, Image, Form, TextInput, Navbar, List, Link, Accordion, Paragraph, RadioButton, TextArea, Header, Card, MultiLineText} from 'library';
import AddScheduleTime from 'projectLibrary/AddScheduleTime.js';
import TimeSelect from 'projectLibrary/timeSelect.js';


class Availability extends Component {
    constructor(props) {
        super(props);
        this.state = {'scheduletimes':[], 'show_calendar':false, 'start_time':'Click To Choose', 'end_time':'Click To Choose', 'choosing':'', 'recurring':false}

        this.objectCallback = this.objectCallback.bind(this);
        this.toggleCalendar = this.toggleCalendar.bind(this);
        this.chooseAvailability = this.chooseAvailability.bind(this);
    }

    componentDidMount() {
      console.log('/api/home/scheduletime/?user=' + this.props.user_id + '&event=' + this.props.event_id)
      ajaxWrapper('GET','/api/home/scheduletime/?user=' + this.props.user_id + '&event=' + this.props.event_id, {}, this.objectCallback);
    }

    objectCallback(result) {
      var scheduletimes = []
      for (var index in result) {
        var scheduletime = result[index]['scheduletime'];
        scheduletimes.push(scheduletime)
      }
      this.setState({'scheduletimes':scheduletimes, 'loaded':true})
    }

    toggleCalendar(value) {
      this.setState({'choosing':value,'show_calendar':true})
    }

    chooseAvailability(value, recurring) {
      var newState = {}
      newState[this.state.choosing] = value;
      newState['show_calendar'] = false;
      newState['recurring'] = recurring
      this.setState(newState)
    }

    render() {
      console.log("Here");

      var scheduletimes = [];
      for (var index in this.state.scheduletimes) {
        var scheduletime = this.state.scheduletimes[index];
        scheduletimes.push(<p>Start Time: {scheduletime.start_time}, End Time: {scheduletime.end_time}, Available: {scheduletime.available}</p>)
      }

      var calendar = null;
      if (this.state.show_calendar) {
        calendar = <TimeSelect recurring={this.state.recurring} chooseAvailability={this.chooseAvailability} />
      }

      var content =
        <div className="container">
          {calendar}
          <Header size={2} text={'Let Us Know Your Availability For: [EVENT]'} />
          <br />
          <AddScheduleTime event_id={this.props.event_id} user_id={this.props.user_id} start_time={this.state.start_time} end_time={this.state.end_time} toggleCalendar={this.toggleCalendar} />
          <br />
          {scheduletimes}
        </div>;

        return (
            <Wrapper loaded={this.state.loaded}  content={content} />
        );
    }
}

export default Availability;
