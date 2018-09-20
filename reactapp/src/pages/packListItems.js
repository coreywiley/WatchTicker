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
            fooditem: {'name':''}
        };

        this.eventCallback = this.eventCallback.bind(this);
        this.deleteEvent = this.deleteEvent.bind(this);
        this.deleteEventCallback = this.deleteEventCallback.bind(this);
        this.fooditemCallback = this.fooditemCallback.bind(this);
    }

    componentDidMount() {
      ajaxWrapper('GET', '/api/home/fooditem/' + this.props.fooditem_id +'/', {}, this.fooditemCallback)
      ajaxWrapper('GET','/api/home/packinglistitem/?food_item=' + this.props.fooditem_id, {}, this.eventCallback)
    }

    fooditemCallback(result) {
      this.setState({fooditem: result[0]['fooditem']})
    }

    eventCallback(result) {

      var eventList = [];
      for (var index in result) {
        eventList.push(result[index]['packinglistitem'])
      }

      this.setState({eventList: eventList, loaded: true})
    }

    deleteEvent(id) {
      console.log(id)
      ajaxWrapper('GET', '/api/home/packinglistitem/' + id + '/delete/', {}, this.deleteEventCallback)
    }

    deleteEventCallback(result) {
      ajaxWrapper('GET','/api/home/packinglistitem/?food_item=' + this.props.fooditem_id, {}, this.eventCallback)
    }

    render() {

      var eventList = []

      console.log("Events", this.state.eventList);
      for (var index in this.state.eventList) {
        console.log("Here")
        var row = <tr>
                      <td>{this.state.eventList[index]['task']}</td>
                      <td><Button type={'info'} text={'Edit'} href={'/newPackListItem/' + this.props.fooditem_id + '/' + this.state.eventList[index]['id'] + '/'} /></td>
                      <td><Button type={'danger'} text={'Delete'} deleteType={true} clickHandler={this.deleteEvent.bind(this,this.state.eventList[index]['id'])} /></td>
                    </tr>;

          eventList.push(row);
      }

      var content =
      <div className='container'>
          <Header size={2} text={'Pack List Items for ' + this.state.fooditem.name} />
          <p><Link text={'Back to Menu Items List.'} link={'/menuItems/'} /></p>
          <table className='table'>
            <tr>
              <th>Task</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
            <tr>
              <td><Button type={'success'} text={'Add New Task'} href={'/newPackListItem/' + this.props.fooditem_id +'/'} /></td>
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

export default Customers;
