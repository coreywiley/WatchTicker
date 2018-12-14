import React, { Component } from 'react';
import { View, StyleSheet, Picker } from 'react-native';
import { Constants } from 'expo';
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';
import Text from './text.js';
import SwipePicker from './swipeInput.js';


export default class DateTimePicker extends Component {
  constructor(props) {
    super(props);

    if (this.props.answer == '' || this.props.answer == undefined || this.props.answer.split('T').length == 1) {
      this.state = {
        month: 'January',
        day: '1',
        year:'2000',
        hour: '08',
        minute:'00',
        ampm:'am'
      }
    }
    else {
      var dateTime = this.props.answer.split('T')
      var values = dateTime[0].split('-')

      console.log("Values",values)
      var ampm = 'am'
      var hour = parseInt(dateTime[1].split(':')[0])
      if (hour > 12) {
        hour = hour - 12
        ampm = 'pm'
      }

      if (hour < 10) {
        hour = '0' + hour
      }
      else {
        hour = hour.toString()
      }

      var minute = dateTime[1].split(':')[1]


      var months = ['January','February','March','April','May','June','July','August','September','October','November','December']
      var month = months[values[1] - 1]

      this.state = {
        month: month,
        day: values[2],
        year:values[0],
        hour: hour,
        minute: minute,
        ampm: ampm
      }
    }

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(name, value) {
    var newState = this.state;
    newState[name] = value;
    if (this.props.date) {
      var months = ['January','February','March','April','May','June','July','August','September','October','November','December']
      var month = months.indexOf(newState.month) + 1
      var date = newState.year + '-' + month + '-' + newState.day
      console.log("Date Change",date)
      this.setState(newState, () => this.props.handleChange(this.props.name, date))
    }
    else if (this.props.time) {
      var hour = parseInt(newState.hour)
      if (newState.ampm == 'pm') {
        hour += 12;
      }
      this.setState(newState, () => this.props.handleChange(this.props.name, hour + ':' + newState.minute + ':00'))
    }
    else {
      this.setState(newState, () => this.props.handleChange(this.props.name, newState.month + ' ' + newState.day + ' ' + newState.year))
    }

  }

  render() {
    pickers = []

    if (this.props.date) {
      var days = [];
      var monthdays = {'January':31, 'February':29, 'March':31, 'April':30, 'May':31,'June':30,'July':31,'August':31,'September':30,'October':31,'November':30,'December':31}
      for (var i = 0; i < monthdays[this.state.month]; i++) {
        var day = (i+1).toString()
        days.push(day)
      }


      var years = [];
      for (var i = 0; i < 153; i++) {
        var year = (2018-150+i).toString();
        years.push(year)
      }


      var months = [];
      for (var month in monthdays) {
        months.push(month);
      }

      pickers.push(<SwipePicker options={months} value={this.state.month} name={'month'} handleChange={this.handleChange} width={'45%'}/>)
      pickers.push(<SwipePicker options={days} value={this.state.day} name={'day'} handleChange={this.handleChange} width={'20%'}/>)
      pickers.push(<SwipePicker options={years} value={this.state.year} name={'year'} handleChange={this.handleChange} width={'35%'}/>)
      var display = <Text style={{textAlign:'center', color: '#a657a2', marginTop:10, marginBottom: 10}}>{this.state.month + ' ' + this.state.day + ', ' + this.state.year}</Text>
    }

    if (this.props.time) {
      var display = <Text style={{textAlign:'center', color: '#a657a2', marginTop:10, marginBottom: 10}}>{this.state.hour + ':' + this.state.minute + ' ' + this.state.ampm}</Text>
      var hours = ['01','02','03','04','05','06','07','08','09','10','11','12'];
      var minutes = ['00','05','10','15','20','25','30','35','40','45','50','55'];
      var ampm = ['am','pm'];


      pickers.push(<SwipePicker options={hours} value={this.state.hour} name={'hour'} handleChange={this.handleChange} width={'33%'}/>)
      pickers.push(<SwipePicker options={minutes} value={this.state.minute} name={'minute'} handleChange={this.handleChange} width={'33%'}/>)
      pickers.push(<SwipePicker options={ampm} value={this.state.ampm} name={'ampm'} handleChange={this.handleChange} width={'33%'}/>)
    }

    return (
      <View style={{'backgroundColor':'#fff', width:'80%',alignItems:'center', justifyContent:'center', borderRadius:25}}>
        {display}
        <View style={{'flexDirection':'row',  alignItems:'center', justifyContent:'center', width:'90%', padding:20, borderTopWidth: 2, borderColor: '#a657a2'}}>
          {pickers}
        </View>
      </View>
    );
  }
}
