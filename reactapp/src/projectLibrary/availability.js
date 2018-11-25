import React, { Component } from 'react';

import Wrapper from 'base/wrapper.js';
import ajaxWrapper from 'base/ajax.js';
import {Container, Button, Image, Form, TextInput, Navbar, List, Link, Accordion, Paragraph, RadioButton, TextArea, Header, Card, MultiLineText} from 'library';
import AddScheduleTime from 'projectLibrary/AddScheduleTime.js';


class Availability extends Component {
    constructor(props) {
        super(props);
        this.state = {'scheduletimes':[], 'name':'', 'required':true, 'invite':{'required':true}}

        this.objectCallback = this.objectCallback.bind(this);
        this.toggleCalendar = this.toggleCalendar.bind(this);
        this.chooseAvailability = this.chooseAvailability.bind(this);
        this.refreshData = this.refreshData.bind(this);
        this.getEventInfo = this.getEventInfo.bind(this);
        this.getInviteInfo = this.getInviteInfo.bind(this);
    }

    componentDidMount() {
      this.refreshData();
      ajaxWrapper('GET','/api/home/event/' + this.props.event_id + '/', {}, this.getEventInfo)

      if (this.props.invite_id) {
        ajaxWrapper('GET','/api/home/invite/' + this.props.invite_id + '/', {}, this.getInviteInfo)
      }
    }

    getInviteInfo(result) {
      var invite = result[0]['invite'];
      this.setState({'invite':invite})
    }

    getEventInfo(result) {
      var event = result[0]['event'];
      this.setState(event)
    }

    refreshData() {
      ajaxWrapper('GET','/api/home/scheduletime/?related=user&user=' + this.props.user_id + '&event=' + this.props.event_id, {}, this.objectCallback);
      this.setState({'start_time':'Click To Choose', 'end_time':'Click To Choose'})
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

      var scheduletimes = [];
      for (var index in this.state.scheduletimes) {
        var scheduletime = this.state.scheduletimes[index];
        scheduletimes.push(<div style={{'width':'100%', 'borderBottom':'2px solid black', 'marginBottom':'10px'}}></div>)
        scheduletimes.push(<AddScheduleTime {...scheduletime} required={scheduletime['required']} refreshData={this.refreshData} toggleCalendar={this.toggleCalendar} key={index} scheduleTimes={this.state.scheduletimes} />)
      }

      var required = this.state.invite.required;

      var content =
        <div className="container">
          <Header size={2} text={'Let Us Know Your Availability For: ' + this.state.name} />
          <br />
          <AddScheduleTime event_id={this.props.event_id} required={required} user_id={this.props.user_id} key={-1} refreshData={this.refreshData} scheduleTimes={this.state.scheduletimes} />
          <br />
          {scheduletimes}
        </div>;

        return (
            <Wrapper loaded={this.state.loaded}  content={content} />
        );
    }
}

export default Availability;
