import React, { Component } from 'react';

import Wrapper from 'base/wrapper.js';
import ajaxWrapper from 'base/ajax.js';
import {Container, Button, Image, Form, TextInput, List, Link, Accordion, Paragraph, RadioButton, TextArea, Header, Table} from 'library';
import Navbar from 'projectLibrary/nav.js';

class Events extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
            eventList: [],
        };

        this.eventCallback = this.eventCallback.bind(this);
        this.deleteEvent = this.deleteEvent.bind(this);
        this.deleteEventCallback = this.deleteEventCallback.bind(this);
    }

    componentDidMount() {
      ajaxWrapper('GET','/api/home/event/?user=' + this.props.user_id, {}, this.eventCallback)
    }

    eventCallback(result) {
      var eventList = [];
      for (var index in result) {
        eventList.push(result[index]['event'])
      }

      this.setState({eventList: eventList, loaded: true})
    }

    deleteEvent(id) {
      console.log(id)
      ajaxWrapper('GET', '/api/home/event/' + id + '/delete/', {}, this.deleteEventCallback)
    }

    deleteEventCallback(result) {
      ajaxWrapper('GET','/api/home/event/?user=' + this.props.user_id, {}, this.eventCallback)
    }

    render() {

      var eventList = []

      console.log("Events", this.state.eventList);
      for (var index in this.state.eventList) {
        console.log("Here")
        var row = <tr>
                      <td>{this.state.eventList[index]['date']}</td>
                      <td>{this.state.eventList[index]['name']}</td>
                      <td>{this.state.eventList[index]['guest_count']}</td>
                      <td><Button type={'success'} text={'Menu'} href={'/menu/' + this.state.eventList[index]['id'] + '/'} /></td>
                      <td><Button type={'success'} text={'Shopping List'} href={'/shoplist/' + this.state.eventList[index]['id'] + '/'} /></td>
                      <td><Button type={'success'} text={'Prep List'} href={'/preplist/' + this.state.eventList[index]['id'] + '/'} /></td>
                      <td><Button type={'success'} text={'Decor List'} href={'/decorlist/' + this.state.eventList[index]['id'] + '/'} /></td>
                      <td><Button type={'success'} text={'Pack List'} href={'/packlist/' + this.state.eventList[index]['id'] + '/'} /></td>
                      <td><Button type={'primary'} text={'Print All'} href={'/printAll/' + this.state.eventList[index]['id'] + '/'} /></td>
                      <td><Button type={'info'} text={'Edit Event'} href={'/newEvent/' + this.state.eventList[index]['id'] + '/'} /></td>
                      <td><Button type={'danger'} text={'Delete Event'} clickHandler={this.deleteEvent.bind(this, this.state.eventList[index]['id'])} /></td>
                    </tr>;
          eventList.push(row);
      }

      var content =
        <div className='container'>
          <Button href={'/dailypreplist/'} text={'Daily Prep List'} type={'primary'} />
          <Header size={2} text={'My Events'} />
          <table className='table'>
            <tr>
              <th>Date</th>
              <th>Name</th>
              <th>Number of Guests</th>
              <th>Menu</th>
              <th>Shopping List</th>
              <th>Prep List</th>
              <th>Decor List</th>
              <th>Pack List</th>
              <th>Print All</th>
              <th>Edit Event</th>
              <th>Delete Event</th>
            </tr>
            <tr>
              <td></td>
              <td><Button type={'success'} text={'Add New Event'} href={'/newEvent/'} /></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            {eventList}
          </table>


        </div>;



        return (
          <div>
            <Navbar logged_in={true} logOut={this.props.logOut} />
            <Wrapper loaded={this.state.loaded}  content={content} />
          </div>
        );
    }
}

export default Events;
