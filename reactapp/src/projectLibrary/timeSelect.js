import React, { Component } from 'react';
import ajaxWrapper from '../base/ajax.js';
import {Card, Header, Button, Select} from 'library';
import Availability from 'projectLibrary/availability.js';
import Wrapper from 'base/wrapper.js';
import {DateTime} from 'luxon';

function findTimeSchedules(date, scheduleTimes, scope, timezone) {

  var iterations = 12;
  var times = [];
  var startingIndex = 0;

  if (scope == 'Early Morning' || scope == 'Monthly' || scope == 'Daily') {
    startingIndex = 0
    if (scope != 'Early Morning') {
      iterations = 48;
    }
  }
  else if (scope == 'Morning') {
    startingIndex = 12
  }
  else if (scope == 'Afternoon') {
    startingIndex = 24
  }
  else if (scope == 'Night') {
    startingIndex = 36
  }

  for (var i = startingIndex; i < startingIndex + iterations; i++) {
    var canMake = [];
    var cantMake = [];
    var display = true;

    var hour = Math.floor(i/2);
    var minute = (i % 2) * 30;

    var adjustedHour = hour;

    if (hour == 0) {
      adjustedHour = 12;
    }
    else if (hour > 12) {
      adjustedHour = hour - 12
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

    var time = adjustedHour + ':' + minute + ampm;

    var repeat_days = ['repeat_sunday','repeat_monday','repeat_tuesday','repeat_wednesday','repeat_thursday','repeat_friday','repeat_saturday']

    for (var index in scheduleTimes) {

      var scheduletime = scheduleTimes[index];
      console.log("Timezone", timezone)
      var timeOffset = DateTime.local().setZone(timezone).offset - DateTime.local().setZone(scheduletime['timezone']).offset;
      var hourOffset = Math.floor(timeOffset/60)

      var required = scheduletime['required'];

      var repeat = false;
      for (var index in repeat_days) {
        if (scheduletime[repeat_days[index]] == true) {
          repeat = true;
        }
      }

      if (repeat) {
        var day = date.getDay();
        if (scheduletime[repeat_days[day]]) {
          var start_time = scheduletime['start_time'].split("T")[1]
          var startHour = parseInt(start_time.split(":")[0]) + hourOffset
          if (startHour < 0) {
            startHour = 24 + startHour
          }
          else if (startHour > 24) {
            startHour = startHour - 24
          }

          var startMinute = parseInt(start_time.split(":")[1])

          var end_time = scheduletime['end_time'].split("T")[1]
          var endHour = parseInt(end_time.split(":")[0]) + hourOffset

          if (endHour < 0) {
            endHour = 24 + endHour
          }
          else if (endHour > 24) {
            endHour = endHour - 24
          }

          var endMinute = parseInt(end_time.split(":")[1])

          if (startHour > endHour) {
            if ((hour > startHour || (hour == startHour && minute >= startMinute)) || (hour < endHour  || (hour == endHour && minute <= endMinute))) {
              if (scheduletime['available']) {
                if (required) {
                  display = true;
                }
                else {
                  canMake.push(scheduletime.user)
                }
              }
              else {
                if (required) {
                  display = false;
                }
                else {
                  cantMake.push(scheduletime.user)
                }
              }
            }
          }
          else {
            if ((hour > startHour || (hour == startHour && minute >= startMinute)) && (hour < endHour || (hour == endHour && minute < endMinute))) {
              if (scheduletime['available']) {
                if (required) {
                  display = true;
                }
                else {
                  canMake.push(scheduletime.user)
                }
              }
              else {
                if (required) {
                  display = false;
                }
                else {
                  cantMake.push(scheduletime.user)
                }
              }
            }
          }
        }
      }
    }

    if (display) {
      times.push({canMake:canMake, cantMake:cantMake, date: date, time: time, hour: adjustedHour, minute:minute, ampm:ampm})
    }

  }

  return times;
}


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

        var canMake = [];
        var cantMake = [];
        for (var index in this.props.canMake) {
          var user = this.props.canMake[index];
          canMake.push(<p style={{'color':'green'}}>{user['first_name'] + ' ' + user['last_name']} can make it.</p>)
        }

        for (var index in this.props.cantMake) {
          var user = this.props.cantMake[index];
          cantMake.push(<p style={{'color':'red'}}>{user['first_name'] + ' ' + user['last_name']} can make it.</p>)
        }

        var description = <div>{canMake}{cantMake}</div>

        return (
            <div onClick={this.submitTime}><Card css={this.props.style} name={this.props.time} description={description} /></div>
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

        var scopes = ['Early Morning','Morning','Afternoon','Night'];
        var scheduleTimes = findTimeSchedules(this.props.date,this.props.scheduleTimes, scopes[j], this.props.timezone)

        times.push(<div onClick={openFunction}><Card key={this.props.date.getDate() + '_' + j} name={timeSections[j]} description={scheduleTimes.length + ' times available.'}/></div>)
      }
    }
    else {
      var startingIndex = 0;
      var openTimes = this.state.openTimes;
      var times = [];
      var scopes = ['Early Morning','Morning','Afternoon','Night'];

      var sectionHeader = <div><p>{scopes[openTimes - 1]}</p><Button type={'primary'} text={'Back To All Times'} clickHandler={this.openAll} /></div>

      times.push(sectionHeader);

      var scheduleTimes = findTimeSchedules(this.props.date,this.props.scheduleTimes, scopes[openTimes - 1], this.props.timezone)

      for (var index in scheduleTimes) {
        var time = scheduleTimes[index]
        times.push(<TimeChoice {...time} chooseAvailability={this.props.chooseAvailability} />);
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
          <TimeSections timezone={this.props.timezone} chooseAvailability={this.props.chooseAvailability} scheduleTimes={this.props.scheduleTimes} date={this.props.date} />
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

    var scheduleTimes = findTimeSchedules(this.props.date,this.props.scheduleTimes, 'Monthly', this.props.timezone)

    if (scheduleTimes.length == 0) {
      backgroundColor = '#f2cece';
    }

    return (
      <td style={{'padding':'30px', 'fontSize': '30px','backgroundColor':backgroundColor, 'color':color}} onClick={this.chooseDay} onMouseEnter={this.toggleHover} onMouseLeave={this.toggleHover}>{this.props.day}<p style={{'fontSize':'12px'}}>{scheduleTimes.length + ' times available.'}</p></td>
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
          dayRow.push(<MonthDay timezone={this.props.timezone} chooseAvailability={this.props.chooseAvailability} scheduleTimes={this.props.scheduleTimes} thisMonth={thisMonth} day={dayString} date={currentDate} setDate={this.props.setDate} />)

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
          dayRow.push(<MonthDay timezone={this.props.timezone} chooseAvailability={this.props.chooseAvailability} scheduleTimes={this.props.scheduleTimes} thisMonth={thisMonth} day={dayString} date={currentDate} setDate={this.props.setDate} />)
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
          days.push(<div className='col-md-3'><Day timezone={this.props.timezone} chooseAvailability={this.props.chooseAvailability} scheduleTimes={this.props.scheduleTimes} day={dateString} date={indexDate} /></div>)
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
    this.setFormState = this.setFormState.bind(this);
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

  setFormState(newState) {
    this.setState(newState)
  }

  render() {


    var dateView = <Month chooseAvailability={this.props.chooseAvailability} timezone={this.props.timezone} scheduleTimes={this.props.scheduleTimes} setDate={this.setDate} date={this.state.currentDate} />
    if (this.state.view == 'Daily') {
      dateView = <Year chooseAvailability={this.props.chooseAvailability} timezone={this.props.timezone} scheduleTimes={this.props.scheduleTimes} setDate={this.setDate} date={this.state.currentDate} />
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
      content = <div>
        <Day date={this.state.currentDate} chooseAvailability={this.props.chooseAvailability} scheduleTimes={this.props.scheduleTimes} />
      </div>
    }

    return (
      <Wrapper loaded={true} content={content} />
    );
  }
}


export default View;
