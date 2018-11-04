import React, { Component } from 'react';
import ajaxWrapper from '../base/ajax.js';
import {Card, Header, Button} from 'library';


class TimeChoice extends React.Component {
    render() {

        return (
            <Card name={this.props.time} />
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

        times.push(<TimeChoice time={hour + ":" + minute + ampm} />);
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
          <TimeSections />
        </div>
      );
  }

}


class Week extends React.Component {
    render() {
        var dayList = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
        var days = [];
        for (var i = 0; i < 7; i++) {
          days.push(<div className='col-md-3'><Day day={dayList[i]} /></div>)
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

    this.chooseDay = this.chooseDay.bind(this);

  }

  chooseDay() {
    this.props.setDate(this.props.date, 'Daily')
  }

  render() {

    return (
      <div style={{'display':'inline', 'padding':'20px', 'height':'20px'}} onClick={this.chooseDay}>{this.props.day}</div>
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

    for (var i = 0; i < 7; i++) {
      days.push(<div style={{'display':'inline', 'padding':'20px', 'height':'20px'}}>{dayData[i]}</div>)
    }
    days.push(<br />)
    for (var i = 0; i < 42; i++) {
        var currentDate = this.addDays(startDate, i);
        if (i % 7 == 0 && i != 0) {
          days.push(<br />)
          if (currentDate.getMonth() != firstDay.getMonth()) {
            i = 42;
          }
          else {
            var dayString = currentDate.getDate();
            if (currentDate.getDate() < 10) {
              dayString = '0' + currentDate.getDate()
            }
            days.push(<MonthDay day={dayString} date={currentDate} setDate={this.props.setDate} />)
          }
        }

        else {
          var dayString = currentDate.getDate();
          if (currentDate.getDate() < 10) {
            dayString = '0' + currentDate.getDate()
          }
          days.push(<MonthDay day={dayString} date={currentDate} setDate={this.props.setDate} />)
        }

    }

    return (
      <div>
        <p>{monthData[firstDay.getMonth()]} {firstDay.getFullYear()}</p>
        <Button text={'Back'} clickHandler={this.back} type={'primary'} />
        <Button text={'Forward'} clickHandler={this.forward} type={'primary'} />
        <br />
        {days}
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
          days.push(<div className='col-md-3'><Day day={dateString} /></div>)
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
    var dateView = <Month setDate={this.setDate} date={this.state.currentDate} />
    if (this.state.view == 'Daily') {
      dateView = <Year setDate={this.setDate} date={this.state.currentDate} />
    }

    var alternateView = 'Monthly';
    if (this.state.view == 'Monthly') {
      alternateView = 'Daily'
    }

    return (
      <div>
        <Button text={'View ' + alternateView} clickHandler={this.changeView}  type={'primary'} />
        {dateView}
      </div>
    );
  }
}


export default View;
