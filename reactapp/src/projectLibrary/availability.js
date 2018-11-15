import React, { Component } from 'react';

import Wrapper from 'base/wrapper.js';
import ajaxWrapper from 'base/ajax.js';
import {Container, Button, Image, Form, TextInput, Navbar, List, Link, Accordion, Paragraph, RadioButton, TextArea, Header, Card, MultiLineText} from 'library';
import AddScheduleTime from 'projectLibrary/AddScheduleTime.js';


class Availability extends Component {
    constructor(props) {
        super(props);
        this.state = {'scheduletimes':[]}

        this.objectCallback = this.objectCallback.bind(this);
        this.toggleCalendar = this.toggleCalendar.bind(this);
        this.chooseAvailability = this.chooseAvailability.bind(this);
        this.refreshData = this.refreshData.bind(this);
    }

    componentDidMount() {
      this.refreshData();
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
        scheduletimes.push(<AddScheduleTime {...scheduletime} refreshData={this.refreshData} toggleCalendar={this.toggleCalendar} key={index} scheduleTimes={this.state.scheduletimes} />)
      }

      var content =
        <div className="container">
          <Header size={2} text={'Let Us Know Your Availability For: [EVENT]'} />
          <br />
          <AddScheduleTime event_id={this.props.event_id} user_id={this.props.user_id} key={-1} refreshData={this.refreshData} scheduleTimes={this.state.scheduletimes} />
          <br />
          {scheduletimes}
        </div>;

        return (
            <Wrapper loaded={this.state.loaded}  content={content} />
        );
    }
}

export default Availability;
