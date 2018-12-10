import React from 'react';
import { StyleSheet, View, AsyncStorage, TouchableWithoutFeedback } from 'react-native';
import Text from '../library/text.js';
import {LinearGradient} from 'expo';

class NormaButton extends React.Component {
  render() {
    var textColor = '#a657a1'
    var colors = ['#ffffff','#ffffff']
    if (this.props.selected) {
      var textColor = 'white'
      var colors = ['#52bfa6', '#3e8797'];
    }
    if (this.props.purple) {
      var colors = ['#bd83b9', '#7d5d9b'];
      textColor = 'white';
    }

    var style = {'width':170, paddingLeft:15, paddingRight:15, height: 50, 'margin':10, 'justifyContent':'center', 'alignItems':'center', 'borderRadius':50, 'elevation':10};
    if (this.props.width) {
      style['width'] = this.props.width;
    }
    if (this.props.zIndex) {
      style['zIndex'] = this.props.zIndex;
    }

    return (
      <View style={shadows}>
      <TouchableWithoutFeedback onPress={this.props.onPress} style={{'zIndex':10, elevation:3}}>
        <LinearGradient
          colors={colors}
          style={style}
          start={[0,0]}
          end={[1,0]}>
          <Text style={{'color':textColor,'textAlign':'center'}} >{this.props.text}</Text>
          </LinearGradient>
        </TouchableWithoutFeedback>
      </View>

    )
  }
}

const shadows = StyleSheet.create({
  shadowOffset: { width: 10, height: 10 },
  shadowOpacity: 1,
  elevation: 3,
  zIndex:999,
});

export default NormaButton;
