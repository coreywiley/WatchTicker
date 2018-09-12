import React, { Component } from 'react';

import Wrapper from 'base/wrapper.js';
import ajaxWrapper from 'base/ajax.js';
import {Container, Button, Image, Form, TextInput, Navbar, List, Link, Accordion, Paragraph, RadioButton, TextArea, Header, Table} from 'library';

class Customers extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: true,
            eventList: [],
            fooditem: {'name':''}
        };

        this.eventCallback = this.eventCallback.bind(this);
    }

    componentDidMount() {
      ajaxWrapper('GET','/api/home/event/?related=orders,orders__food_item&user_id=' + this.props.user_id, {}, this.eventCallback)

    }


    eventCallback(result) {

      var eventList = [];
      for (var index in result) {
        eventList.push(result[index]['event'])
      }

      this.setState({eventList: eventList, loaded: true})
    }

    DayAsString(dayIndex) {
      var weekdays = [new Array(7)];
      weekdays[0] = "Sun";
      weekdays[1] = "Mon";
      weekdays[2] = "Tue";
      weekdays[3] = "Wed";
      weekdays[4] = "Thur";
      weekdays[5] = "Fri";
      weekdays[6] = "Sat";

      return weekdays[dayIndex];
  }

    render() {
      var currentDate = new Date();
      var startDate = new Date();
      var next7DaysHeaders = [];
      var next7Days = [];
      var next7DaysFoodPrep = {};
      for (var i = 0; i < 7; i++) {
        currentDate.setDate(startDate.getDate() + i);
        var dayString = this.DayAsString(currentDate.getDay());
        next7DaysHeaders.push(<th>{dayString}</th>)
        next7Days.push([(currentDate.getMonth() + 1).toString(), currentDate.getDate().toString(), currentDate.getFullYear().toString()])
      }
      console.log("Next 8 Days", next7Days);

      for (var index in this.state.eventList) {
        var dateSplit = this.state.eventList[index]['date'].split('/')

        for (var day in next7Days) {
          if (next7Days[day][0] == dateSplit[0] && next7Days[day][1] == dateSplit[1] && next7Days[day][2] == dateSplit[2]) {
            console.log("Match")
            for (var i in this.state.eventList[index]['orders']) {
              var food_item = this.state.eventList[index]['orders'][i]['order']['food_item']
              console.log("Food Item", food_item)
              if (food_item['name'] in next7DaysFoodPrep) {
                next7DaysFoodPrep[food_item['name']][day] = 'Gill';
              }
              else {
                next7DaysFoodPrep[food_item['name']] = ['','','','','','','']
                next7DaysFoodPrep[food_item['name']][day] = 'Gill';
              }
            }
          }
        }

      }

      var tableRows = [];
      for (var i in next7DaysFoodPrep) {
        var row = <tr><td>{i}</td>
            <td>{next7DaysFoodPrep[i][0]}</td>
            <td>{next7DaysFoodPrep[i][1]}</td>
            <td>{next7DaysFoodPrep[i][2]}</td>
            <td>{next7DaysFoodPrep[i][3]}</td>
            <td>{next7DaysFoodPrep[i][4]}</td>
            <td>{next7DaysFoodPrep[i][5]}</td>
            <td>{next7DaysFoodPrep[i][6]}</td>
            </tr>;
          tableRows.push(row);

      }


      var content =
        <div className='container'>
          <table className='table'>
            <tr>
              <th>Item To Prep</th>
              {next7DaysHeaders}
            </tr>
            {tableRows}
          </table>


        </div>;



        return (
            <Wrapper loaded={this.state.loaded}  content={content} />
        );
    }
}

export default Customers;
