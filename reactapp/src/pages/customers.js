import React, { Component } from 'react';

import Wrapper from 'base/wrapper.js';
import ajaxWrapper from 'base/ajax.js';
import {Container, Button, Image, Form, TextInput, List, Link, Accordion, Paragraph, RadioButton, TextArea, Header, Table} from 'library';
import Navbar from 'projectLibrary/nav.js';

class Customers extends Component {
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
      ajaxWrapper('GET','/api/home/customer/?user=' + this.props.user_id, {}, this.eventCallback)
    }

    eventCallback(result) {
      var eventList = [];
      for (var index in result) {
        eventList.push(result[index]['customer'])
      }

      this.setState({eventList: eventList, loaded: true})
    }

    deleteEvent(id) {
      console.log(id)
      ajaxWrapper('GET', '/api/home/customer/' + id + '/delete/', {}, this.deleteEventCallback)
    }

    deleteEventCallback(result) {
      ajaxWrapper('GET','/api/home/customer/?user=' + this.props.user_id, {}, this.eventCallback)
    }

    render() {

      var eventList = []

      console.log("Events", this.state.eventList);
      for (var index in this.state.eventList) {
        console.log("Here")
        var row = <tr>
                      <td>{this.state.eventList[index]['name']}</td>
                      <td>{this.state.eventList[index]['address']}</td>
                      <td>{this.state.eventList[index]['phone']}</td>
                      <td>{this.state.eventList[index]['email']}</td>
                      <td><Button type={'info'} text={'Edit'} href={'/newCustomer/' + this.state.eventList[index]['id'] + '/'} /></td>
                      <td><Button type={'danger'} text={'Delete'} clickHandler={this.deleteEvent.bind(this,this.state.eventList[index]['id'])} /></td>
                    </tr>;
          eventList.push(row);
      }

      var content =
        <div className='container'>
        <div style={{'marginBottom':'25px'}}>
          <Button type={'success'} text={'Add New Customer'} href={'/newCustomer/'} />
        </div>
          <Header size={2} text={'My Customers'} />
          <table className='table'>
            <tr>
              <th>Name</th>
              <th>Address</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Edit</th>
              <th>Delete</th>
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

export default Customers;
