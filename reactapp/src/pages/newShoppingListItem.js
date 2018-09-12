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
            fooditem: {'name':''},
            task: '',
        };

        this.eventCallback = this.eventCallback.bind(this);
        this.fooditemCallback = this.fooditemCallback.bind(this);
    }

    componentDidMount() {
      ajaxWrapper('GET','/api/home/fooditem/' + this.props.fooditem_id +'/', {}, this.fooditemCallback)
      if (this.props.shoppinglistitem_id) {
        ajaxWrapper('GET','/api/home/shoppinglistitem/' + this.props.shoppinglistitem_id + '/', {}, this.eventCallback)
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
      var defaults = {'task':this.state.task, 'food_item':this.props.fooditem_id};
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
          <div>
            <Navbar logged_in={true} logOut={this.props.logOut} />
            <Wrapper loaded={this.state.loaded}  content={content} />
          </div>
        );
    }
}

export default NewMenuItem;
