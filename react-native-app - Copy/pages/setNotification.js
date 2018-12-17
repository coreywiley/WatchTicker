import React from 'react';
import { TouchableWithoutFeedback, Image,StyleSheet, View, AsyncStorage, ScrollView, TextInput } from 'react-native';
import ajaxWrapper from '../base/ajax.js';
import { Form, Container, Header, Title, Content,Left, Right, Body, Card, CheckBox, CardItem, List, ListItem, InputGroup, Input, Spinner, Item, Label, Textarea} from 'native-base';
import DateTimePicker from '../library/DateTimePicker.js';
import ButtonSelect from '../library/buttonSelect.js';
import {LinearGradient} from 'expo';
import Button from '../localLibrary/button.js';
import Footer from '../localLibrary/footer.js';
import Text from '../library/text.js';
import Loading from '../library/loading.js';
import SwipeInput from '../library/swipeInput.js';


class SetNotification extends React.Component {
  constructor(props) {
      super(props);
      this.state = {screen:1, reminder_time:'T08:00', reminder_day: 1, 'settings':{'last_menstruation_day':''}};

      this.handleChange = this.handleChange.bind(this);
      this.settingsCallback = this.settingsCallback.bind(this);
      this.noMenstrualCycle = this.noMenstrualCycle.bind(this);
      this.setMenstrualCycle = this.setMenstrualCycle.bind(this);
      this.reminderDay = this.reminderDay.bind(this);
      this.setReminderTime = this.setReminderTime.bind(this);
      this.setAppointment = this.setAppointment.bind(this);
  }

    noMenstrualCycle() {
      var newState = this.state.settings;
      newState['last_menstruation_day'] = undefined;
      this.setState({settings:newState})
    }

    setMenstrualCycle() {
      console.log("this.state.settings.last_menstruation_day", this.state.settings.last_menstruation_day)
      ajaxWrapper('POST','/api/home/usersettings/' + this.state.settings.id + '/', {'last_menstruation_day':this.state.settings.last_menstruation_day, 'breast_exam_reminders':true}, () => this.setState({'screen':2}))
    }

    reminderDay(num) {
      this.setState({'reminderDay':num, 'screen':2})
    }

    setReminderTime() {
      if (this.state.settings.last_menstruation_day == undefined) {
        var date = new Date();
        var dateString = (date.getYear() + 1900) + '-1-' + this.state.reminderDay + 'T' + this.state.reminder_time
        console.log("Datestring",dateString)
        ajaxWrapper('POST','/api/home/usersettings/' + this.state.settings.id + '/', {'last_menstruation_day':'', 'reminder_day':dateString, breast_exam_reminders: true}, () => this.props.setGlobalState('page','journalEntries'))
      }
      else {
        var dateString = this.state.settings.last_menstruation_day.split('T')[0] + 'T' + this.state.reminder_time
        console.log("Datestring",dateString)
        ajaxWrapper('POST','/api/home/usersettings/' + this.state.settings.id + '/', {'last_menstruation_day':dateString, 'reminder_day':'', breast_exam_reminders: true}, () => this.props.setGlobalState('page','journalEntries'))
      }
    }

    componentDidMount(value) {
        ajaxWrapper('GET','/api/home/usersettings/?user=' + this.props.userId,{},this.settingsCallback)
    }

    settingsCallback(result) {
      var usersettings = result[0]['usersettings'];
      if (usersettings['country_of_origin'] == '') {
        usersettings['country_of_origin'] = 'United States of America'
      }
      console.log("last_menstruation_day", usersettings['last_menstruation_day'])
      if (usersettings['last_menstruation_day'] == undefined) {
        var date = new Date();
        usersettings['last_menstruation_day'] = (date.getYear() + 1900) + '-' + (date.getMonth() + 1) + '-' + date.getDate() + 'T8:00:00'
      }
      if (usersettings['mammogram_reminder'] == undefined) {
        var date = new Date();
        usersettings['mammogram_reminder'] = (date.getYear() + 1900) + '-' + (date.getMonth() + 1) + '-' + date.getDate() + 'T8:00:00'
      }
      if (usersettings['gynocology_reminder'] == undefined) {
        var date = new Date();
        usersettings['gynocology_reminder'] = (date.getYear() + 1900) + '-' + (date.getMonth() + 1) + '-' + date.getDate() + 'T8:00:00'
      }
      if (usersettings['physical_reminder'] == undefined) {
        var date = new Date();
        usersettings['physical_reminder'] = (date.getYear() + 1900) + '-' + (date.getMonth() + 1) + '-' + date.getDate() + 'T8:00:00'
      }
      this.setState({'settings':usersettings, loaded:true})
    }

    setAppointment() {
      var newState = {}
      newState[this.props.appointment + '_reminder'] = this.state.settings[this.props.appointment + '_reminder']

      console.log("Settings", this.state.settings)
      ajaxWrapper('POST','/api/home/usersettings/' + this.state.settings.id + '/', newState, () => this.props.setGlobalState('page','doctors'))
    }

    handleChange(name,value, multi=false) {
        var newState = {};
        console.log("Handle Change",name,value,multi)
        if (multi) {
          console.log("Multi", value)
          if (this.state.answer == '') {
            var newValue = [];
          }
          else {
            if (typeof(this.state.answer) == 'string') {
              var newValue = JSON.parse(this.state.answer)
            }
            else {
              var newValue = this.state.answer;
            }
          }
          console.log("New Value", newValue)
          var index = newValue.indexOf(value)
          if (index == -1) {
            newValue.push(value);
          }
          else {
            newValue.splice(index,1)
          }

          newState[name] = newValue;
        }
        else {
          if (name == 'country_of_origin' || name == 'zip_code' || name == 'last_menstruation_day') {
            newState['settings'] = this.state.settings;
            newState['settings'][name] = value;
          }
          else if (name == this.props.appointment + '_reminder') {
            newState['settings'] = this.state.settings;
            newState['settings'][name] = value + 'T08:00:00';
          }
          else {
            newState[name] = value;
          }
        }

        console.log("New State", newState)
        var newCompleteState = this.state;
        newCompleteState[name] = value;
        this.setState(newState);
    }

    render() {
        if (this.state.loaded) {
          var content = [];
          if (this.props.appointment == 'menstrual' && this.state.screen == 1) {
            if (this.state.settings.last_menstruation_day != undefined){
              content.push(<Text style={{'color':'#fff', marginTop:'20%', 'width':'80%', marginBottom:20, textAlign:'center'}}>When was the last day of your last menstrual cycle?</Text>)
              content.push(<DateTimePicker name={'last_menstruation_day'} answer={this.state.settings.last_menstruation_day} handleChange={this.handleChange} date={true} />)
              content.push(<View style={{'width':'80%', marginTop:20}}><Button width={'95%'} text={"I don't remember"} onPress={this.noMenstrualCycle} /></View>)
              content.push(<View style={{'width':'80%', marginTop:20}}><Button width={'95%'} text={"I don't have a menstrual cycle"} onPress={this.noMenstrualCycle} /></View>)
              content.push(<View style={{'width':'80%', marginTop:20}}><Button width={'95%'} selected={true} text={"Submit"} onPress={this.setMenstrualCycle} /></View>)
            }
            else if (this.state.settings.last_menstruation_day == undefined) {
              content.push(<Text style={{'color':'#fff', marginTop:'20%', 'width':'80%', marginBottom:20, textAlign:'center'}}>You indicated that you do not have a regular menstrual cycle or do not remember the last day of your cycle. Please select the best time of the month for us to remind you to do your self-exam. You can change this at any time in Settings.</Text>)
              content.push(<View style={{'width':'80%', marginTop:20}}><Button width={'95%'} text={"1st of the month"} onPress={() => this.reminderDay(1)}/></View>)
              content.push(<View style={{'width':'80%', marginTop:20}}><Button width={'95%'} text={"15th of the month"} onPress={() => this.reminderDay(15)}/></View>)
            }

          }
          else if (this.state.screen == 2) {
              content.push(<Text style={{'color':'#fff', marginTop:'20%', width:'80%', marginBottom:20, textAlign:'center'}}>Attaching your breast self-exam to a routine activity like your typical shower is a good way to build a habit.</Text>)
              content.push(<Text style={{'color':'#fff', 'width':'80%', marginBottom:20, textAlign:'center'}}>What time would you like us to send you a once-a-month reminder?</Text>)
              content.push(<DateTimePicker name={'reminder_time'} answer={this.state.reminder_time} handleChange={this.handleChange} time={true} />)
              content.push(<Button text={'Set'} selected={true} onPress={this.setReminderTime} />)
          }
          else {
            content.push(<Text style={{'color':'#fff', marginTop:'20%', 'width':'80%', marginBottom:20, textAlign:'center'}}>When do you want a reminder to book your next {this.props.appointment} appointment?</Text>)
            content.push(<DateTimePicker name={this.props.appointment + '_reminder'} answer={this.state.settings[this.props.appointment + '_reminder']} handleChange={this.handleChange} date={true} />)
            content.push(<View style={{'width':'80%', marginTop:20}}><Button width={'95%'} text={"I don't need a reminder."} onPress={() => this.props.setGlobalState('page','doctors')} /></View>)
            content.push(<View style={{'width':'80%', marginTop:20}}><Button width={'95%'} selected={true} text={"Submit"} onPress={this.setAppointment} /></View>)
          }


          return (
            <View>
            <LinearGradient
              colors={['#52bfa6', '#3e8797']}
              style={{alignItems: 'center', 'height':'100%', 'width':'100%'}}>

              <ScrollView style={{'height':'100%','width':'100%'}}>
              <View style={{alignItems:'center', justifyContent:'center'}}>
                {content}
                </View>
              </ScrollView>

              </LinearGradient>
              </View>
          );
        }
        else {
          return (
            <Loading />
          );
        }

    }
}

export default SetNotification;
