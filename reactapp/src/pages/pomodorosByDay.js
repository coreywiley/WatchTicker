
import React, { Component } from 'react';

import Wrapper from 'base/wrapper.js';
import ajaxWrapper from 'base/ajax.js';
import {Container, Button, Image, Form, TextInput, Navbar, List, Link, Accordion, Paragraph, RadioButton, TextArea, Header, Card, MultiLineText} from 'library';

class TaskList extends Component {
    constructor(props) {
        super(props);
        this.state = {'pomodoros':[]}

        this.objectCallback = this.objectCallback.bind(this);
        this.startPomodoro = this.startPomodoro.bind(this);
        this.refresh = this.refresh.bind(this);
    }

    componentDidMount() {
      this.refresh();
    }

    refresh() {
      console.log("Refreshing");
      ajaxWrapper('GET','/api/home/pomodoro/?order_by=-created_at&task__user=' + this.props.user.id, {}, this.objectCallback);
    }

    startPomodoro() {
      this.setState({pomodoro:true, seconds:25*60})
      this.interval = setInterval(() => this.tick(), 1000);
    }


    objectCallback(result) {
      console.log("Callback")
      var tasks = []
      for (var index in result) {
        var task = result[index]['pomodoro'];
        tasks.push(task)
      }
      this.setState({'pomodoros':tasks, 'loaded':true})
    }

    render() {
      console.log("Here");

      var pomodoros_by_day = {};
      var days = [];
      for (var index in this.state.pomodoros) {
        var pomodoro = this.state.pomodoros[index];
        var created = pomodoro['created_at']
        console.log("Date", created, Date.parse(created))
        var date = new Date(Date.parse(created));
        var date_string = (parseInt(date.getMonth()) + 1) + '/' + date.getDate() + '/' + date.getFullYear()
        if (days.indexOf(date_string) == -1) {
          days.push(date_string);
          pomodoros_by_day[date_string] = 0
        }
        pomodoros_by_day[date_string] += 1;

      }

      var rows = [];
      var weekly_total = 0;
      for (var index in days) {
        weekly_total += pomodoros_by_day[days[index]]

        rows.push(<tr>
          <td>{days[index]}</td>
          <td>{pomodoros_by_day[days[index]]}</td>
          <td>{pomodoros_by_day[days[index]] * 25}</td>
        </tr>)

      }

      var content =
        <div className="container">
          <Header size={2} text={'Pomodoro Analytics'} />
          <br />
          <table className='table'>
            <tr>
              <td>Date</td>
              <td>Number of Pomodoros</td>
              <td>Minutes</td>
            </tr>
            <tr>
              <th>Weekly Goal</th>
              <th>96</th>
              <th>2400</th>
            </tr>
            {rows}
          </table>
        </div>;


        return (
            <Wrapper loaded={this.state.loaded}  content={content} />
        );
    }
}

export default TaskList;
