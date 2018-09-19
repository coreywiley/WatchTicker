import React, { Component } from 'react';

import Wrapper from 'base/wrapper.js';
import ajaxWrapper from 'base/ajax.js';
import {Container, Button, Image, Form, TextInput, List, Link, Accordion, Paragraph, RadioButton, TextArea, Header, Table, NumberInput, DateTimePicker, Select} from 'library';
import Navbar from 'projectLibrary/nav.js';

class NewEvent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
            customer: '',
            name: '',
            date: '',
            leave_time: '',
            arrival_time: '',
            location: '',
            occasion: '',
            notes: '',
            guest_count: 0,
            user: this.props.user_id,
        };

        this.eventCallback = this.eventCallback.bind(this);
    }

    componentDidMount() {
      if (this.props.event_id) {
        ajaxWrapper('GET','/api/home/event/' + this.props.event_id + '/', {}, this.eventCallback)
      }
      else {
        this.setState({'loaded':true})
      }
    }

    eventCallback(result) {
      console.log("Result",result)
      var eventDetails = result[0]['event'];
      eventDetails['customer'] = eventDetails['customer_id']
      eventDetails['loaded'] = true;
      this.setState(eventDetails)
    }

    render() {

      var customer_props = {'label':'Customer', 'name':'customer', 'value':this.state.customer, 'optionsUrl': '/api/home/customer/?user_id=' + this.props.user_id, 'optionsUrlMap': {'text':['customer','name'],'value':['customer','id']}}
      var name_props = {'label':'Event Name', 'name':'name', 'value':this.state.name, 'placeholder': 'James and Jills Wedding'}
      var date = {'label':'Date', 'name':'date', 'value': this.state.date, 'placeholder': '09/20/2020', 'display_time': false}
      var leave_time = {'label':'Leave Time', 'name': 'leave_time', 'value':this.state.leave_time, 'placeholder': '12:15 PM', 'display_date': false}
      var arrival_time = {'label':'Arrival Time', 'name': 'arrival_time', 'value':this.state.arrival_time, 'placeholder': '1:00 PM', 'display_date':false}
      var location = {'label':'Location', 'name':'location', 'value':this.state.location, 'placeholder': '123 Fake Street'}
      var occasion = {'label':'Occasion', 'name': 'occasion', 'value': this.state.occasion, 'placeholder': 'Wedding'}
      var guest_count = {'label':'Guest Count', 'name': 'guest_count', 'value':this.state.value, 'placeholder': 0}
      var notes = {'label':'Notes','name':'notes','value':this.state.notes,'placeholder':''}
      var defaults = this.state;

      var submitUrl = '/api/home/event/';
      if (this.props.event_id) {
        submitUrl += this.props.event_id + '/';
      }
      var redirectUrl = '/events/';


      var content =
        <div className='container'>
          <Header size={2} text={'Create New Event'} />
          <p>If you cant find the customer, <Link text={'create a customer first.'} link={'/newCustomer/'} /></p>
          <Form components={[Select, TextInput, DateTimePicker, DateTimePicker, DateTimePicker, TextInput, TextInput, NumberInput, TextArea]} first={true} componentProps={[customer_props, name_props, date, leave_time, arrival_time, location, occasion, guest_count, notes]} submitUrl={submitUrl} defaults={defaults} redirectUrl={redirectUrl}/>
        </div>;

        return (
          <div>
            <Navbar logged_in={true} logOut={this.props.logOut} />
            <Wrapper loaded={this.state.loaded}  content={content} />
          </div>
        );
    }
}

export default NewEvent;
