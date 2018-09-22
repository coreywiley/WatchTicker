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
                          <table className="table">
                            <tr>
                              <th style={{'padding':'0px','border-top':'0px'}}>Event Name</th>
                              <td style={{'padding':'0px','border-top':'0px'}}>{this.state.eventInfo['name']}</td>
                              <th style={{'padding':'0px','border-top':'0px'}}>Customer Name</th>
                              <td style={{'padding':'0px','border-top':'0px'}}>{this.state.eventInfo['customer']['name']}</td>
                            </tr>
                            <tr>
                              <th style={{'padding':'0px','border-top':'0px'}}>Event Date</th>
                              <td style={{'padding':'0px','border-top':'0px'}}>{this.state.eventInfo['date']}</td>
                              <th style={{'padding':'0px','border-top':'0px'}}>Customer Phone</th>
                              <td style={{'padding':'0px','border-top':'0px'}}>{this.state.eventInfo['customer']['phone']}</td>
                            </tr>
                            <tr>
                              <th style={{'padding':'0px','border-top':'0px'}}>Arrival Time</th>
                              <td style={{'padding':'0px','border-top':'0px'}}>{this.state.eventInfo['arrival_time']}</td>
                              <th style={{'padding':'0px','border-top':'0px'}}>Customer Email</th>
                              <td style={{'padding':'0px','border-top':'0px'}}>{this.state.eventInfo['customer']['email']}</td>
                            </tr>
                            <tr>
                              <th style={{'padding':'0px','border-top':'0px'}}>Leave Kitchen Time</th>
                              <td style={{'padding':'0px','border-top':'0px'}}>{this.state.eventInfo['leave_time']}</td>
                              <th style={{'padding':'0px','border-top':'0px'}}>Location</th>
                              <td style={{'padding':'0px','border-top':'0px'}}>{this.state.eventInfo['address'] + ', ' + this.state.eventInfo['city'] + ' ' + this.state.eventInfo['state'] + ' ' + this.state.eventInfo['zip']}</td>
                            </tr>
                            <tr>
                              <th style={{'padding':'0px','border-top':'0px'}}>Occasion</th>
                              <td style={{'padding':'0px','border-top':'0px'}}>{this.state.eventInfo['occasion']}</td>
                              <th style={{'padding':'0px','border-top':'0px'}}>Customer Notes</th>
                              <td style={{'padding':'0px','border-top':'0px', 'maxWidth':'250px'}}>{this.state.eventInfo['customer']['notes']}</td>
                            </tr>
                            <tr>
                              <th style={{'padding':'0px','border-top':'0px'}}>Guest Count</th>
                              <td style={{'padding':'0px','border-top':'0px'}}>{this.state.eventInfo['guest_count']}</td>
                              <th style={{'padding':'0px','border-top':'0px'}}>Event Notes</th>
                              <td style={{'padding':'0px','border-top':'0px', 'maxWidth':'250px'}}>{this.state.eventInfo['notes']}</td>
                            </tr>
                          </table>
                        </div>;
      }

      var content =
        <div className='container'>
        <div style={{'marginTop':'25px'}}>
          <Button clickHandler={() => window.print()} type={'success'} text={'Print'} />
        </div>
          <Header css={{'padding':'50px','color':'#cb4154', 'text-align':'center'}} size={1} text={'Orders for ' + this.state.eventInfo.name} />
          {eventInfo}
          <div style={{'marginTop':'35px','marginBottom':'50px'}}>
          <Header size={2} text={'Menu Items'} />
          </div>
          <table className='table'>
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
