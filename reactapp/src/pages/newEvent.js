import React, { Component } from 'react';

import Wrapper from 'base/wrapper.js';
import ajaxWrapper from 'base/ajax.js';
import {Container, Button, Image, Form, TextInput, Navbar, List, Link, Accordion, Paragraph, RadioButton, TextArea, Header, Table, NumberInput, DateTimePicker, Select} from 'library';

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
      var date = {'label':'Date', 'name':'date', 'value': this.state.date, 'placeholder': '09/20/2020'}
      var leave_time = {'label':'Leave Time', 'name': 'leave_time', 'value':this.state.leave_time, 'placeholder': '12:15 PM'}
      var arrival_time = {'label':'Arrival Time', 'name': 'arrival_time', 'value':this.state.arrival_time, 'placeholder': '1:00 PM'}
      var location = {'label':'Location', 'name':'location', 'value':this.state.location, 'placeholder': '123 Fake Street'}
      var occasion = {'label':'Occasion', 'name': 'occasion', 'value': this.state.occasion, 'placeholder': 'Wedding'}
      var guest_count = {'label':'Guest Count', 'name': 'guest_count', 'value':this.state.value, 'placeholder': 0}
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
          <Form components={[Select, TextInput, TextInput, TextInput, TextInput, TextInput, TextInput, NumberInput]} first={true} componentProps={[customer_props, name_props, date, leave_time, arrival_time, location, occasion, guest_count]} submitUrl={submitUrl} defaults={defaults} redirectUrl={redirectUrl}/>
        </div>;

        return (
            <Wrapper loaded={this.state.loaded}  content={content} />
        );
    }
}

export default NewEvent;
