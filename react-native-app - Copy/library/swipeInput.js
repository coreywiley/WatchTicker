import React, { Component } from 'react';
import { View, StyleSheet, Picker } from 'react-native';
import { Constants } from 'expo';
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';
import Text from './text.js';

class SwipeInput extends Component {
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
      directionalOffsetThreshold: 200
    };

    var textAlign = 'left';
    if (this.props.center) {
      textAlign = 'center'
    }

    return (
      <GestureRecognizer onSwipeUp={this.onSwipeUp} onSwipeDown={this.onSwipeDown} style={{'width':this.props.width}} config={config}>
        <Text style={{padding:10, color:'#cfa6cd', textAlign:textAlign}}>{options[next]}</Text>
        <Text style={{padding:10, borderTopWidth: 2, borderBottomWidth:2, color:'#a657a2', borderColor: '#a657a2', textAlign:textAlign}}>{options[index]}</Text>
        <Text style={{padding:10, color:'#cfa6cd', textAlign:textAlign}}>{options[before]}</Text>
      </GestureRecognizer>
    )
  }
}

export default SwipeInput
