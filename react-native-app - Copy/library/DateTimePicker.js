import React, { Component } from 'react';
import { View, StyleSheet, Picker } from 'react-native';
import { Constants } from 'expo';
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';
import Text from './text.js';

class SwipePicker extends Component {
  constructor(props) {
    super(props);

    this.onSwipeUp = this.onSwipeUp.bind(this);
    this.onSwipeDown = this.onSwipeDown.bind(this);
  }

  onSwipeUp(gestureState) {
    console.log("Swipe Up")
    var options = this.props.options;
    var index = options.indexOf(this.props.value)
    if (index == 0) {
      var before = options.length - 1;
    }
    else {
      var before = index - 1;
    }

    this.props.handleChange(this.props.name, options[before])
  }

  onSwipeDown(gestureState) {
    console.log("Swipe Down")
    var options = this.props.options;
    var index = options.indexOf(this.props.value)
    if (index == options.length - 1) {
      var next = 0;
    }
    else {
      var next = index + 1;
    }

    this.props.handleChange(this.props.name, options[next])
  }

  render() {
    var options = this.props.options;
    var index = options.indexOf(this.props.value)

    if (index == -1) {
      index = 0;
    }

    if (index == 0) {
      var before = options.length - 1;
    }
    else {
      var before = index - 1;
    }

    if (index == options.length - 1) {
      var next = 0;
    }
    else {
      var next = index + 1;
    }

    const config = {
      velocityThreshold: 1,
      directionalOffsetThreshold: 80
    };

    return (
      <GestureRecognizer onSwipeUp={this.onSwipeUp} onSwipeDown={this.onSwipeDown} style={{'width':this.props.width}} config={config}>
        <Text style={{padding:10, color:'#cfa6cd'}}>{options[next]}</Text>
        <Text style={{padding:10, borderTopWidth: 2, borderBottomWidth:2, color:'#a657a2', borderColor: '#a657a2'}}>{options[index]}</Text>
        <Text style={{padding:10, color:'#cfa6cd'}}>{options[before]}</Text>
      </GestureRecognizer>
    )
  }
}

export default class DateTimePicker extends Component {
  constructor(props) {
    super(props);

    if (this.props.answer == '') {
      this.state = {
        month: 'January',
        day: '1',
        year:'2000',
      }
    }
    else {
      var values = this.props.answer.split(' ')
      this.state = {
        month: values[0],
        day: values[1],
        year:values[2],
      }
    }

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(name, value) {
    var newState = this.state;
    newState[name] = value;

    this.setState(newState, () => this.props.handleChange(this.props.name, newState.month + ' ' + newState.day + ' ' + newState.year + ' '))
  }

  render() {

    if (this.props.date) {
      var days = [];
      var monthdays = {'January':31, 'February':29, 'March':31, 'April':30, 'May':31,'June':30,'July':31,'August':31,'September':30,'October':31,'November':30,'December':31}
      for (var i = 0; i < monthdays[this.state.month]; i++) {
        var day = (i+1).toString()
        days.push(day)
      }

      var years = [];
      for (var i = 0; i < 150; i++) {
        var year = (2018-150+i).toString();
        years.push(year)
      }

      var months = [];
      for (var month in monthdays) {
        months.push(month);
      }

    }

    return (
      <View style={{'backgroundColor':'#fff', width:'80%',alignItems:'center', justifyContent:'center', borderRadius:25}}>
        <Text style={{textAlign:'center', color: '#a657a2', marginTop:10, marginBottom: 10}}>{this.state.month + ' ' + this.state.day + ', ' + this.state.year}</Text>
        <View style={{'flexDirection':'row',  alignItems:'center', justifyContent:'center', width:'90%', padding:20, borderTopWidth: 2, borderColor: '#a657a2'}}>
          <SwipePicker options={months} value={this.state.month} name={'month'} handleChange={this.handleChange} width={'45%'}/>
          <SwipePicker options={days} value={this.state.day} name={'day'} handleChange={this.handleChange} width={'20%'}/>
          <SwipePicker options={years} value={this.state.year} name={'year'} handleChange={this.handleChange} width={'35%'}/>
        </View>
      </View>
    );
  }
}
