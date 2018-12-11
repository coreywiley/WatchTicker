import React from 'react';
import { StyleSheet, View, AsyncStorage, Image, ScrollView, PanResponder, Animated, TouchableWithoutFeedback} from 'react-native';
import ajaxWrapper from '../base/ajax.js';
import { Form, Container, Header, Title, Content, FooterTab, Left, Right, Body, Card, CheckBox, CardItem, List, ListItem, InputGroup, Input, Spinner, Item, Label, Textarea} from 'native-base';
import ButtonSelect from '../library/buttonSelect.js';
import {LinearGradient} from 'expo';
import Button from '../localLibrary/button.js';
import Text from '../library/text.js';
import CustomPhoto from './customPhoto.js';
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';
var add_entry = require('../assets/Customization/add.png')
var edit_entry = require('../assets/Customization/edit.png')


class JournalCard extends React.Component {

  onSwipeLeft(gestureState) {
    if (this.props.prev) {
      this.props.prev();
    }
  }

  onSwipeRight(gestureState) {
    if (this.props.next) {
      this.props.next();
    }
  }

  render() {

    var date = '11 16 2018';
    var notes = 'Click on the plus sign to add your first entry';
    if (this.props.journal) {
      var date = this.props.journal.date;
      var notes = this.props.journal.notes;
    }

    const config = {
      velocityThreshold: 0.3,
      directionalOffsetThreshold: 80
    };


    var notes_section = null;
    var date_title = <View style={{width:'70%', bottom:-50, zIndex:10000}}>
          <LinearGradient
            colors={['#bd83b9', '#7d5d9b']}
            style={{'width':'100%', paddingLeft:15, paddingRight:15, height: 50, 'margin':0, 'justifyContent':'center', 'alignItems':'center', 'borderRadius':50, flexDirection:'row'}}
            start={[0,0]}
            end={[1,0]}>
              <Text style={{'color':'white','textAlign':'right'}} >{date}</Text>
          </LinearGradient>
      </View>
    if (this.props.summarize != false) {
      var date_title = <View style={{width:'70%', bottom:-50, right:-20, zIndex:10000}}>
            <LinearGradient
              colors={['#52bfa6', '#3e8797']}
              style={{'width':'100%', paddingLeft:'55%', paddingRight:0, height: 50, 'margin':0, 'justifyContent':'center', 'alignItems':'center', 'borderRadius':50, flexDirection:'row'}}
              start={[0,0]}
              end={[1,0]}>
                <Text style={{'color':'white','textAlign':'right'}} >{date}</Text>
                <TouchableWithoutFeedback onPress={() => this.props.chooseJournal(undefined)} style={{'alignSelf':'flex-end', 'justifySelf':'right', 'zIndex':10000}}>
                    <Image source={add_entry} style={{marginLeft:'20%', width: 50,height:50, right:0, 'alignSelf':'flex-end', 'justifySelf':'flex-end','zIndex':10000}} resizeMode="contain" />
                </TouchableWithoutFeedback>
            </LinearGradient>
        </View>

      var notes_section = <View style={{'height':'30%', 'width':'80%', 'backgroundColor':'#c2b3d2', 'borderRadius':25, top: -50}}>
        <View style={{'marginTop':60, marginLeft: 15}}>
          <Text style={{'color':'#a657a1'}}>{notes}</Text>
        </View>
        <TouchableWithoutFeedback onPress={() => this.props.chooseJournal(this.props.journal)}>
          <Image source={add_entry} style={{margin:0, width: '30%','height':'30%', position:'absolute', bottom:'-10%', right:'-10%'}} resizeMode="contain" />
        </TouchableWithoutFeedback>
      </View>
    }

    console.log("Symptom Details Jounral Card", this.props.symptom_details)

    return(
      <View style={{'width':'100%', 'alignItems':'center', 'justifyContent':'center', margin:0}}>
      <GestureRecognizer
        onSwipeLeft={(state) => this.onSwipeLeft(state)}
        onSwipeRight={(state) => this.onSwipeRight(state)}
        config={config}
        style={{'width':'100%', 'alignItems':'center', 'justifyContent':'center'}}>

        {date_title}

        <CustomPhoto {...this.props.customize} symptom_details={this.props.symptom_details} setSymptomCoords={this.props.setSymptomCoords}/>

        {notes_section}

        </GestureRecognizer>
      </View>
    )
  }
}

export default JournalCard;
