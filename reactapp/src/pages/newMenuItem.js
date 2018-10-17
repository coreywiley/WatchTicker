import React, { Component } from 'react';

import Wrapper from 'base/wrapper.js';
import ajaxWrapper from 'base/ajax.js';
import {Container, Button, Image, Form, TextInput, List, Link, Accordion, Paragraph, RadioButton, TextArea, Header, Table, NumberInput} from 'library';
import Navbar from 'projectLibrary/nav.js';

class NewMenuItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
            name: '',
            user: this.props.user_id,
        };

        this.eventCallback = this.eventCallback.bind(this);
    }

    componentDidMount() {
      if (this.props.fooditem_id) {
        ajaxWrapper('GET','/api/home/fooditem/' + this.props.fooditem_id + '/', {}, this.eventCallback)
      }
      else {
        this.setState({'loaded':true})
      }
    }

    eventCallback(result) {
      var customerDetails = result[0]['fooditem'];
      customerDetails['loaded'] = true;
      this.setState(customerDetails)
    }

    render() {

      var name_props = {'label': 'Name', 'name':'name', 'value':this.state.name}
      var defaults = this.state;
      var submitUrl = '/api/home/fooditem/';
      if (this.props.customer_id) {
        submitUrl += this.props.fooditem_id + '/';
      }
      var redirectUrl = '/menuItems/';


      var content =
        <div className={'container'}>
          <Header size={2} text={'Create New Menu Item'} />
          <Form components={[TextInput]} first={true} componentProps={[name_props]} submitUrl={submitUrl} defaults={defaults} redirectUrl={redirectUrl}/>
        </div>;

        return (
          <div>
            <Navbar is_staff={this.props.is_staff} logged_in={true} logOut={this.props.logOut} />
            <Wrapper loaded={this.state.loaded}  content={content} />
          </div>
        );
    }
}

export default NewMenuItem;
