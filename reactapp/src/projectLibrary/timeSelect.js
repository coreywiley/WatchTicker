import React, { Component } from 'react';
import ajaxWrapper from '../base/ajax.js';
import {Card, Header, Button} from 'library';
import Availability from 'projectLibrary/availability.js';
import Wrapper from 'base/wrapper.js';

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

      date += ' ' + hour + ':' + this.props.minute

      this.props.chooseAvailability(date)
    }


    render() {

        return (
            <div onClick={this.submitTime}><Card css={this.props.style} name={this.props.time} /></div>
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
        startingIndex = 12
        sectionHeader = <div><p>{timeSections[openTimes - 1]}</p><Button type={'primary'} text={'Back To All Times'} clickHandler={this.openAll} /></div>
      }
      else if (openTimes == 3) {
        startingIndex = 24
        sectionHeader = <div><p>{timeSections[openTimes - 1]}</p><Button type={'primary'} text={'Back To All Times'} clickHandler={this.openAll} /></div>
      }
      else if (openTimes == 4) {
        startingIndex = 36
        sectionHeader = <div><p>{timeSections[openTimes - 1]}</p><Button type={'primary'} text={'Back To All Times'} clickHandler={this.openAll} /></div>
      }

      times.push(sectionHeader);

      for (var i = startingIndex; i < startingIndex + 12; i++) {
        console.log("Hello", this.props.scheduleTimes)
        var hour = Math.floor(i/2);
        var minute = (i % 2) * 30;

        var color = 'black';
        var repeat_days = ['repeat_sunday','repeat_monday','repeat_tuesday','repeat_wednesday','repeat_thursday','repeat_friday','repeat_saturday']
        for (var index in this.props.scheduleTimes) {

          var scheduletime = this.props.scheduleTimes[index];

          var repeat = false;
          for (var index in repeat_days) {
            if (scheduletime[repeat_days[index]] == true) {
              repeat = true;
            }
          }

          console.log("Repeat Variable", repeat)
          if (repeat) {
            var day = this.props.date.getDay();
            console.log("Repeat!!", day, scheduletime[repeat_days[day]])
            if (scheduletime[repeat_days[day]]) {
              var start_time = scheduletime['start_time'].split("T")[1]
              var startHour = parseInt(start_time.split(":")[0])
              var startMinute = parseInt(start_time.split(":")[1])

              var end_time = scheduletime['end_time'].split("T")[1]
              var endHour = parseInt(end_time.split(":")[0])
              var endMinute = parseInt(end_time.split(":")[1])
              console.log("Start and End Time", startHour, startMinute, endHour, endMinute, hour, minute)
              if (startHour > endHour) {
                if ((hour < startHour || (hour == startHour && minute <= startMinute)) || (hour > endHour  || (hour == endHour && minute >= endMinute))) {
                  if (scheduletime['available']) {
                    color = 'green';
                  }
                  else {
                    color = 'red';
                  }
                }
              }
              else {
                if ((hour > startHour || (hour == startHour && minute >= startMinute)) && (hour < endHour || (hour == endHour && minute < endMinute))) {
                  if (scheduletime['available']) {
                    color = 'green';
                  }
                  else {
                    color = 'red';
                  }
                }
              }
            }
          }
        }


        if (hour == 0) {
          hour = 12;
        }
        else if (hour > 12) {
          hour = hour - 12
        }


        if (minute == 0) {
          minute = '00'
        }

        if (i > 23) {
          var ampm = " PM"
        }
        else {
          var ampm = " AM"
        }

        times.push(<TimeChoice date={this.props.date} style={{'color':color}} chooseAvailability={this.props.chooseAvailability} scheduleTimes={this.props.scheduleTimes} time={hour + ":" + minute + ampm} hour={hour} minute={minute} ampm={ampm} />);
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
          <TimeSections chooseAvailability={this.props.chooseAvailability} scheduleTimes={this.props.scheduleTimes} date={this.props.date} />
        </div>
      );
  }

}


class Week extends React.Component {
    render() {
        var dayList = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
        var days = [];
        for (var i = 0; i < 7; i++) {
          days.push(<div className='col-md-3'><Day chooseAvailability={this.props.chooseAvailability} scheduleTimes={this.props.scheduleTimes} day={dayList[i]} /></div>)
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
          dayRow.push(<MonthDay chooseAvailability={this.props.chooseAvailability} scheduleTimes={this.props.scheduleTimes} thisMonth={thisMonth} day={dayString} date={currentDate} setDate={this.props.setDate} />)

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
          dayRow.push(<MonthDay chooseAvailability={this.props.chooseAvailability} scheduleTimes={this.props.scheduleTimes} thisMonth={thisMonth} day={dayString} date={currentDate} setDate={this.props.setDate} />)
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
          days.push(<div className='col-md-3'><Day chooseAvailability={this.props.chooseAvailability} scheduleTimes={this.props.scheduleTimes} day={dateString} date={indexDate} /></div>)
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
    var dateView = <Month chooseAvailability={this.props.chooseAvailability} scheduleTimes={this.props.scheduleTimes} setDate={this.setDate} date={this.state.currentDate} />
    if (this.state.view == 'Daily') {
      dateView = <Year chooseAvailability={this.props.chooseAvailability} scheduleTimes={this.props.scheduleTimes} setDate={this.setDate} date={this.state.currentDate} />
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
      content = <div><Day date={this.state.currentDate} chooseAvailability={this.props.chooseAvailability} scheduleTimes={this.props.scheduleTimes} /></div>
    }

    return (
      <Wrapper loaded={true} content={content} />
    );
  }
}


export default View;
