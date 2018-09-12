import React, { Component } from 'react';

import Wrapper from 'base/wrapper.js';
import ajaxWrapper from 'base/ajax.js';
import {Container, Button, Image, Form, TextInput, Navbar, List, Link, Accordion, Paragraph, RadioButton, TextArea, Header, Table, Select} from 'library';

class Customers extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
            eventList: [],
            fooditem: {'name':''},
            eventInfo:{'name':''}
        };

        this.eventCallback = this.eventCallback.bind(this);
        this.deleteEvent = this.deleteEvent.bind(this);
        this.deleteEventCallback = this.deleteEventCallback.bind(this);
        this.eventInfoCallback = this.eventInfoCallback.bind(this);
        this.refreshOrders = this.refreshOrders.bind(this);
    }

    componentDidMount() {
      ajaxWrapper('GET','/api/home/event/' + this.props.event_id + '/', {}, this.eventInfoCallback)
      ajaxWrapper('GET','/api/home/order/?related=food_item&event=' + this.props.event_id, {}, this.eventCallback)
    }

    eventInfoCallback(result) {
      this.setState({eventInfo: result[0]['event']})
    }

    refreshOrders() {
        ajaxWrapper('GET','/api/home/order/?related=food_item&event=' + this.props.event_id, {}, this.eventCallback)
    }

    eventCallback(result) {

      var eventList = [];
      for (var index in result) {
        eventList.push(result[index]['order'])
      }

      this.setState({eventList: eventList, loaded: true})
    }

    deleteEvent(id) {
      console.log(id)
      ajaxWrapper('GET', '/api/home/order/' + id + '/delete/', {}, this.deleteEventCallback)
    }

    deleteEventCallback(result) {
      ajaxWrapper('GET','/api/home/order/?related=food_item&event=' + this.props.event_id, {}, this.eventCallback)
    }

    render() {

      var eventList = []

      console.log("Events", this.state.eventList);
      for (var index in this.state.eventList) {
        var row = <tr>
                      <td>{this.state.eventList[index]['food_item']['name']}</td>
                      <td>{this.state.eventList[index]['quantity']}</td>
                      <td><Button type={'danger'} text={'Delete'} clickHandler={this.deleteEvent.bind(this,this.state.eventList[index]['id'])} /></td>
                    </tr>;
          eventList.push(row);
      }

      var food_props = {'label': 'Menu Item', 'name':'food_item', 'value':'', 'optionsUrl':'/api/home/fooditem/?user_id=' + this.props.user_id, 'optionsUrlMap': {'text':['fooditem','name'],'value':['fooditem','id']}}
      var quantity = {'label': 'Quantity', 'name':'quantity', 'value':1}
      var defaults = {'quantity':1, 'food_item':'', 'event':this.props.event_id};
      var submitUrl = '/api/home/order/';

      var content =
        <div className='container'>
          <Header size={2} text={'Orders for ' + this.state.eventInfo.name} />
          <table className='table'>
            <tr>
              <th>Menu Item</th>
              <th>Quantity</th>
              <th>Delete</th>
            </tr>
            {eventList}
          </table>

          <Header size={4} text={'Create New Order for ' + this.state.eventInfo.name} />
          <Form components={[Select, TextInput]} first={true} componentProps={[food_props, quantity]} submitUrl={submitUrl} defaults={defaults} redirect={this.refreshOrders}/>


        </div>;



        return (
            <Wrapper loaded={this.state.loaded}  content={content} />
        );
    }
}

export default Customers;
