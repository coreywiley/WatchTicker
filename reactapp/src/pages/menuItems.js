import React, { Component } from 'react';

import Wrapper from 'base/wrapper.js';
import ajaxWrapper from 'base/ajax.js';
import {Container, Button, Image, Form, TextInput, List, Link, Accordion, Paragraph, RadioButton, TextArea, Header, Table} from 'library';
import Navbar from 'projectLibrary/nav.js';

class MenuItems extends Component {
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
      ajaxWrapper('GET','/api/home/fooditem/?user=' + this.props.user_id, {}, this.eventCallback)
    }

    eventCallback(result) {
      var eventList = [];
      for (var index in result) {
        eventList.push(result[index]['fooditem'])
      }

      this.setState({eventList: eventList, loaded: true})
    }

    deleteEvent(id) {
      console.log(id)
      ajaxWrapper('GET', '/api/home/fooditem/' + id + '/delete/', {}, this.deleteEventCallback)
    }

    deleteEventCallback(result) {
      ajaxWrapper('GET','/api/home/fooditem/?user=' + this.props.user_id, {}, this.eventCallback)
    }

    render() {

      var eventList = []

      console.log("Events", this.state.eventList);
      for (var index in this.state.eventList) {
        console.log("Here")
        var row = <tr>
                      <td>{this.state.eventList[index]['name']}</td>
                      <td><Button type={'success'} text={'Shopping List'} href={'/shoplistitems/' + this.state.eventList[index]['id'] + '/'} /></td>
                      <td><Button type={'success'} text={'Prep List'} href={'/preplistitems/' + this.state.eventList[index]['id'] + '/'} /></td>
                      <td><Button type={'success'} text={'Decor List'} href={'/decorationlistitems/' + this.state.eventList[index]['id'] + '/'} /></td>
                      <td><Button type={'success'} text={'Pack List'} href={'/packlistitems/' + this.state.eventList[index]['id'] + '/'} /></td>
                      <td><Button type={'info'} text={'Edit'} href={'/newMenuItem/' + this.state.eventList[index]['id'] + '/'} /></td>
                      <td><Button type={'danger'} text={'Delete'} clickHandler={this.deleteEvent.bind(this, this.state.eventList[index]['id'])} /></td>
                    </tr>;
          eventList.push(row);
      }

      var content =
        <div className='container'>
          <Header size={2} text={'Menu Items'} />
          <table className='table'>
            <tr>
              <th>Name</th>
              <th>Shopping List</th>
              <th>Prep List</th>
              <th>Decoration List</th>
              <th>Pack List</th>
              <th>Edit Menu Item</th>
              <th>Delete Menu Item</th>
            </tr>
            <tr>
              <td><Button type={'success'} text={'Add New Menu Item'} href={'/newMenuItem/'} /></td>
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

export default MenuItems;
