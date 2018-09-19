import React, { Component } from 'react';

import Wrapper from 'base/wrapper.js';
import ajaxWrapper from 'base/ajax.js';
import {Container, Button, Image, Form, TextInput, List, Link, Accordion, Paragraph, RadioButton, TextArea, Header, Table, Select} from 'library';
import Navbar from 'projectLibrary/nav.js';

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
      ajaxWrapper('GET','/api/home/event/' + this.props.event_id + '/?related=customer', {}, this.eventInfoCallback)
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
                      <td className='no-print'><Button type={'danger'} text={'Delete'} clickHandler={this.deleteEvent.bind(this,this.state.eventList[index]['id'])} /></td>
                    </tr>;
          eventList.push(row);
      }

      var food_props = {'label': 'Menu Item', 'name':'food_item', 'value':'', 'optionsUrl':'/api/home/fooditem/?user_id=' + this.props.user_id, 'optionsUrlMap': {'text':['fooditem','name'],'value':['fooditem','id']}}
      var quantity = {'label': 'Quantity', 'name':'quantity', 'value':1}
      var defaults = {'quantity':1, 'food_item':'', 'event':this.props.event_id};
      var submitUrl = '/api/home/order/';

      var eventInfo = <div></div>
      if (this.state.loaded == true) {
        var eventInfo = <div className="row" style={{'marginTop':'30px','marginBottom':'30px'}}>
                          <div className="col-md-8">
                            <p style={{'margin':'0'}}><strong>Event Name: </strong>{this.state.eventInfo['name']}</p>
                            <p style={{'margin':'0'}}><strong>Event Date: </strong>{this.state.eventInfo['date']}</p>
                            <p style={{'margin':'0'}}><strong>Arrival Time: </strong>{this.state.eventInfo['arrival_time']}</p>
                            <p style={{'margin':'0'}}><strong>Leave Kitchen Time: </strong>{this.state.eventInfo['leave_time']}</p>
                            <p style={{'margin':'0'}}><strong>Occasion: </strong>{this.state.eventInfo['occasion']}</p>
                            <p style={{'margin':'0'}}><strong>Guest Count: </strong>{this.state.eventInfo['guest_count']}</p>
                          </div>
                          <div className="col-md-4">
                            <p style={{'margin':'0'}}><strong>Customer Name: </strong>{this.state.eventInfo['customer']['name']}</p>
                            <p style={{'margin':'0'}}><strong>Customer Phone: </strong>{this.state.eventInfo['customer']['phone']}</p>
                            <p style={{'margin':'0'}}><strong>Customer Email: </strong>{this.state.eventInfo['customer']['email']}</p>
                            <p style={{'margin':'0'}}><strong>Location: </strong>{this.state.eventInfo['location']}</p>
                            <p style={{'margin':'0'}}><strong>Customer Notes: </strong>{this.state.eventInfo['customer']['notes']}</p>
                            <p style={{'margin':'0'}}><strong>Event Notes: </strong>{this.state.eventInfo['notes']}</p>
                          </div>
                        </div>;
      }

      var content =
        <div className='container'>
          <Header size={2} text={'Orders for ' + this.state.eventInfo.name} />
          {eventInfo}
          <table className='table'>
            <tr>
              <th>Menu Item</th>
              <th className='no-print'>Delete</th>
            </tr>
            {eventList}
          </table>

          <div className="no-print">
          <Header size={4} text={'Create New Order for ' + this.state.eventInfo.name} />
          <Form components={[Select]} first={true} componentProps={[food_props]} submitUrl={submitUrl} defaults={defaults} redirect={this.refreshOrders}/>
          </div>

        </div>;



        return (
          <div>
            <Navbar logged_in={true} logOut={this.props.logOut} />
            <Wrapper loaded={this.state.loaded}  content={content} />
          </div>
        );
    }
}

export default Customers;
