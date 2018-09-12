import React, { Component } from 'react';

import Wrapper from 'base/wrapper.js';
import ajaxWrapper from 'base/ajax.js';
import {Container, Button, Image, Form, TextInput, Navbar, List, Link, Accordion, Paragraph, RadioButton, TextArea, Header, Table, NumberInput} from 'library';

class NewMenuItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
            name: '',
            user: this.props.user_id,
            fooditem: {'name':''}
        };

        this.customerCallback = this.eventCallback.bind(this);
        this.fooditemCallback = this.fooditemCallback.bind(this);
    }

    componentDidMount() {
      ajaxWrapper('GET','/api/home/fooditem/' + this.props.fooditem_id +'/', {}, this.fooditemCallback)
      if (this.props.shoppinglistitem_id) {
        ajaxWrapper('GET','/api/home/shoppinglistitem/' + this.props.customer_id + '/', {}, this.customerCallback)
      }
      else {
        this.setState({'loaded':true})
      }
    }

    fooditemCallback(result) {
      this.setState({fooditem: result[0]['fooditem']})
    }

    eventCallback(result) {
      console.log("Result", result)
      var customerDetails = result[0]['shoppinglistitem'];
      customerDetails['loaded'] = true;
      this.setState(customerDetails)
    }

    render() {

      var name_props = {'label': 'Task', 'name':'task', 'value':this.state.name}
      var defaults = {'task':'', 'food_item':this.props.fooditem_id};
      var submitUrl = '/api/home/shoppinglistitem/';
      if (this.props.shoppinglistitem_id) {
        submitUrl += this.props.shoppinglistitem_id + '/';
      }
      var redirectUrl = '/shopListItems/' + this.props.fooditem_id;


      var content =
        <div className={'container'}>
          <Header size={2} text={'Create New Shopping List Task for ' + this.state.fooditem.name} />
          <Form components={[TextInput]} first={true} componentProps={[name_props]} submitUrl={submitUrl} defaults={defaults} redirectUrl={redirectUrl}/>
        </div>;

        return (
            <Wrapper loaded={this.state.loaded}  content={content} />
        );
    }
}

export default NewMenuItem;
