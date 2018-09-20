import React, { Component } from 'react';

import Wrapper from 'base/wrapper.js';
import ajaxWrapper from 'base/ajax.js';
import {Container, Button, Image, Form, TextInput, List, Link, Accordion, Paragraph, RadioButton, TextArea, Header, Table, NumberInput} from 'library';
import Navbar from 'projectLibrary/nav.js';

class NewCustomer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
            name: '',
            address: '',
            city: '',
            state: '',
            zip: '',
            phone: '',
            email: '',
            notes:'',
            user: this.props.user_id,
        };

        this.customerCallback = this.eventCallback.bind(this);
    }

    componentDidMount() {
      if (this.props.customer_id) {
        ajaxWrapper('GET','/api/home/customer/' + this.props.customer_id + '/', {}, this.customerCallback)
      }
      else {
        this.setState({'loaded':true})
      }
    }

    eventCallback(result) {
      console.log("Result", result)
      var customerDetails = result[0]['customer'];
      customerDetails['loaded'] = true;
      this.setState(customerDetails)
    }

    render() {

      var name_props = {'label': 'Name', 'name':'name', 'value':this.state.name}
      var address = {'label': 'Address', 'name':'address', 'value': this.state.address}
      var city = {'label': 'City', 'name':'city', 'value': this.state.city}
      var state = {'label': 'State', 'name':'state', 'value': this.state.state}
      var zip = {'label': 'Zip Code', 'name':'zip', 'value': this.state.zip}
      var phone = {'label': 'Phone', 'name': 'phone', 'value':this.state.leave_time}
      var email = {'label': 'Email', 'name': 'email', 'value':this.state.arrival_time}
      var notes = {'label':'Notes','name':'notes','value':this.state.notes,'placeholder':''}
      var defaults = this.state;
      var submitUrl = '/api/home/customer/';
      if (this.props.customer_id) {
        submitUrl += this.props.customer_id + '/';
      }
      var redirectUrl = '/customers/';


      var content =
        <div className={'container'}>
          <Header size={2} text={'Create New Customer'} />
          <Form components={[TextInput, TextInput, TextInput, TextInput, TextInput, TextInput, TextInput, TextArea]} first={true} componentProps={[name_props, address,city, state, zip, phone,email, notes]} submitUrl={submitUrl} defaults={defaults} redirectUrl={redirectUrl}/>
        </div>;

        return (
          <div>
            <Navbar logged_in={true} logOut={this.props.logOut} />
            <Wrapper loaded={this.state.loaded}  content={content} />
          </div>
        );
    }
}

export default NewCustomer;
