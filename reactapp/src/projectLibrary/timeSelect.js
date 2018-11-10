import React, { Component } from 'react';
import ajaxWrapper from '../base/ajax.js';
import {Card, Header, Button} from 'library';
import Availability from 'projectLibrary/availability.js';

class TimeChoice extends React.Component {
    constructor(props) {
      super(props)

      this.submitTime = this.submitTime.bind(this);
    }

    submitTime() {
      var date = this.props.date.getFullYear() + '-' + (this.props.date.getMonth() + 1) + '-' + this.props.date.getDate();
      var hour = this.props.hour;
      console.log("Hour",hour, this.props.ampm)
      if (this.props.ampm == ' AM' && this.props.hour == 12) {
        hour = 0;
      }
      else if (this.props.ampm == ' PM' && this.props.hour != 12) {
        hour = hour + 12;
      }
      console.log("Hour2",hour);

      date += ' ' + hour + ':' + this.props.minute

      console.log("Date",date);
      this.props.chooseAvailbility(date)
    }

    render() {

        return (
            <div onClick={this.submitTime}><Card name={this.props.time} /></div>
        );
    }
}


class TimeSections extends React.Component {
  constructor(props) {
    super(props);
    this.state = {'openTimes':0}

    this.openAll = this.openAll.bind(this);
    this.openEarly = this.openEarly.bind(this);
    this.openMorning = this.openMorning.bind(this);
    this.openAfternoon = this.openAfternoon.bind(this);
    this.openNight = this.openNight.bind(this);
  }

  openAll() {
    this.setState({'openTimes':0})
  }

  openEarly() {
    this.setState({'openTimes':1})
  }

  openMorning() {
    this.setState({'openTimes':2})
  }

  openAfternoon() {
    this.setState({'openTimes':3})
  }

  openNight() {
    this.setState({'openTimes':4})
  }

  render() {
    var timeSections = [<span>Early Morning<br />(12am - 6am)</span>,<span>Morning<br />(6am - 12pm)</span>,<span>Afternoon<br />(12pm - 6pm)</span>,<span>Night<br />(6pm - 12am)</span>]
    var times = [];


    if (this.state.openTimes == 0) {
      for (var j = 0; j < 4; j++) {
        var openFunction = this.openEarly
        if (j == 0) {
          openFunction = this.openEarly
        }
        else if (j == 1) {
          openFunction = this.openMorning
        }
        else if (j == 2) {
          openFunction = this.openAfternoon
        }
        else if (j == 3) {
          openFunction = this.openNight
        }

        times.push(<div onClick={openFunction}><Card name={timeSections[j]} /></div>)
      }
    }
    else {
      var startingIndex = 0;
      var openTimes = this.state.openTimes;
      var sectionHeader = null;

      if (openTimes == 1) {
        startingIndex = 0
        sectionHeader = <div><p>{timeSections[openTimes - 1]}</p><Button type={'primary'} text={'Back To All Times'} clickHandler={this.openAll} /></div>
      }
      else if (openTimes == 2) {
        startingIndex = 24
        sectionHeader = <div><p>{timeSections[openTimes - 1]}</p><Button type={'primary'} text={'Back To All Times'} clickHandler={this.openAll} /></div>
      }
      else if (openTimes == 3) {
        startingIndex = 48
        sectionHeader = <div><p>{timeSections[openTimes - 1]}</p><Button type={'primary'} text={'Back To All Times'} clickHandler={this.openAll} /></div>
      }
      else if (openTimes == 4) {
        startingIndex = 72
        sectionHeader = <div><p>{timeSections[openTimes - 1]}</p><Button type={'primary'} text={'Back To All Times'} clickHandler={this.openAll} /></div>
      }

      times.push(sectionHeader);

      for (var i = startingIndex; i < startingIndex + 24; i++) {
        var hour = Math.floor(i/4);
        if (hour == 0) {
          hour = 12;
        }
        else if (hour > 12) {
          hour = hour - 12
        }

        var minute = (i % 4) * 15;
        if (minute == 0) {
          minute = '00'
        }

        if (i > 47) {
          var ampm = " PM"
        }
        else {
          var ampm = " AM"
        }

        times.push(<TimeChoice date={this.props.date} chooseAvailbility={this.props.chooseAvailbility} time={hour + ":" + minute + ampm} hour={hour} minute={minute} ampm={ampm} />);
      }
    }

    return (
        <div>
          {times}
        </div>
    );
  }
}

class Day extends React.Component {

  render() {

      return (
        <div>
          <Header size={3} text={this.props.day} />
          <TimeSections chooseAvailbility={this.props.chooseAvailbility} date={this.props.date} />
        </div>
      );
  }

}


class Week extends React.Component {
    render() {
        var dayList = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
        var days = [];
        for (var i = 0; i < 7; i++) {
          days.push(<div className='col-md-3'><Day chooseAvailbility={this.props.chooseAvailbility} day={dayList[i]} /></div>)
        }

        return (
            <div className='row' style={{'overflowX':'scroll'}}>
              {days}
            </div>
        );
    }
}

class MonthDay extends React.Component {

  constructor(props) {
    super(props);

    this.state = {'hover':false}
    this.chooseDay = this.chooseDay.bind(this);
    this.toggleHover = this.toggleHover.bind(this);
  }

  chooseDay() {
    this.props.setDate(this.props.date, 'Daily')
  }

  toggleHover() {
    this.setState({hover: !this.state.hover})
  }

  render() {

    var backgroundColor = '#fff';
    var color = '#000';

    if (this.state.hover) {
      backgroundColor = 'blue';
      color = '#fff';
    }
    else if (!this.props.thisMonth) {
      backgroundColor = '#999';
    }


    return (
      <td style={{'padding':'30px', 'fontSize': '30px','backgroundColor':backgroundColor, 'color':color}} onClick={this.chooseDay} onMouseEnter={this.toggleHover} onMouseLeave={this.toggleHover}>{this.props.day}</td>
    );
  }
}

class Month extends React.Component {
  constructor(props) {
    super(props);

    this.state = {'monthIndex':0, 'index':0, 'currentDate': props.date}

    this.back = this.back.bind(this);
    this.forward = this.forward.bind(this);
    this.addDays = this.addDays.bind(this);
  }

  back() {
    var index = this.state.monthIndex;
    this.setState({'monthIndex':index - 1})
    var firstDay = new Date(this.state.currentDate.getFullYear(), this.state.currentDate.getMonth() + this.state.monthIndex - 1, 1, 0, 0, 0, 0)
    this.props.setDate(firstDay, 'Monthly')
  }

  forward() {
    var index = this.state.monthIndex;
    this.setState({'monthIndex':index + 1})
    var firstDay = new Date(this.state.currentDate.getFullYear(), this.state.currentDate.getMonth() + this.state.monthIndex + 1, 1, 0, 0, 0, 0)
    this.props.setDate(firstDay, 'Monthly')

  }

  addDays(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }


  render() {
    var monthData = ['January', 'February', 'March', 'April','May','June','July','August','September','October','November','December']
    var dayData = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

    var firstDay = new Date(this.state.currentDate.getFullYear(), this.state.currentDate.getMonth() + this.state.monthIndex, 1, 0, 0, 0, 0)

    var days = [];
    var startDate = this.addDays(firstDay, -1*firstDay.getDay())

    var dayRow = [];

    for (var i = 1; i < 49; i++) {
        var currentDate = this.addDays(startDate, i-1);

        var thisMonth = true;
        if (currentDate.getMonth() != firstDay.getMonth()) {
          thisMonth = false;
        }

        if (i % 7 == 0 && i != 1) {
          var dayString = currentDate.getDate();
          if (currentDate.getDate() < 10) {
            dayString = '0' + currentDate.getDate()
          }
          dayRow.push(<MonthDay chooseAvailbility={this.props.chooseAvailbility} thisMonth={thisMonth} day={dayString} date={currentDate} setDate={this.props.setDate} />)

          days.push(<tr>{dayRow}</tr>)
          var dayRow = [];

          if (currentDate.getMonth() != firstDay.getMonth()) {
            i = 49;
          }

        }
        else {
          var dayString = currentDate.getDate();
          if (currentDate.getDate() < 10) {
            dayString = '0' + currentDate.getDate()
          }
          dayRow.push(<MonthDay chooseAvailbility={this.props.chooseAvailbility} thisMonth={thisMonth} day={dayString} date={currentDate} setDate={this.props.setDate} />)
        }

    }

    console.log("Days!", days.length)

    return (
      <div>
        <p>{monthData[firstDay.getMonth()]} {firstDay.getFullYear()}</p>
        <Button text={'Back'} clickHandler={this.back} type={'primary'} />
        <Button text={'Forward'} clickHandler={this.forward} type={'primary'} />
        <br />
        <table>
          <tr>
            <th>Sunday</th>
            <th>Monday</th>
            <th>Tuesday</th>
            <th>Wednesday</th>
            <th>Thursday</th>
            <th>Friday</th>
            <th>Saturday</th>
          </tr>
          {days}
        </table>
      </div>
    );
  }
}

class Year extends React.Component {
    constructor(props) {
      super(props);

      this.state = {'index':0, 'currentDate': props.date}

      this.back = this.back.bind(this);
      this.forward = this.forward.bind(this);
    }

    back() {

      var index = this.state.index;

      this.setState({'index':index - 4})
      this.props.setDate(this.addDays(this.state.currentDate, this.state.index - 4), 'Daily')


    }

    forward() {
      var index = this.state.index;
      this.setState({'index':index + 4})
      this.props.setDate(this.addDays(this.state.currentDate, this.state.index + 4), 'Daily')

    }

    addDays(date, days) {
      var result = new Date(date);
      result.setDate(result.getDate() + days);
      return result;
    }

    render() {

        var monthData = ['January', 'February', 'March', 'April','May','June','July','August','September','October','November','December']

        var days = [];

        for (var i = 0; i < 4; i++) {
          var indexDate = this.addDays(this.state.currentDate, this.state.index + i);
          var dateString = monthData[indexDate.getMonth()] + " " + indexDate.getDate() + ", " + indexDate.getFullYear()
          days.push(<div className='col-md-3'><Day chooseAvailbility={this.props.chooseAvailbility} day={dateString} date={indexDate} /></div>)
        }

        return (
            <div className='container'>
              <Button text={'Back'} clickHandler={this.back} type={'primary'} />
              <Button text={'Forward'} clickHandler={this.forward} type={'primary'} />
              <div className='row'>
                {days}
              </div>
            </div>
        );
    }
}

class View extends React.Component {
  constructor(props) {
    super(props);
    var date = new Date()
    this.state = {'view':'Monthly', 'currentDate': date}

    this.changeView = this.changeView.bind(this);
    this.setDate = this.setDate.bind(this);
  }

  changeView() {
    if (this.state.view == 'Monthly') {
      this.setState({'view':'Daily'})
    }
    else {
      this.setState({'view':'Monthly'})
    }
  }

  setDate(date, view) {
    this.setState({'currentDate':date, 'view':view})
  }


  render() {
    var dateView = <Month chooseAvailbility={this.props.chooseAvailability} setDate={this.setDate} date={this.state.currentDate} />
    if (this.state.view == 'Daily') {
      dateView = <Year chooseAvailbility={this.props.chooseAvailability} setDate={this.setDate} date={this.state.currentDate} />
    }

    var alternateView = 'Monthly';
    if (this.state.view == 'Monthly') {
      alternateView = 'Daily'
    }

    var content = <div>
      <Button text={'View ' + alternateView} clickHandler={this.changeView}  type={'primary'} />
      {dateView}
    </div>
    if (this.props.recurring) {
      content = <div><Day chooseAvailbility={this.props.chooseAvailability} /></div>
    }

    return (
      <Wrapper loaded={true} content={content} />
    );
  }
}


export default View;
