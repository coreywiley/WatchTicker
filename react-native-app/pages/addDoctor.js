import React from 'react';
import { StyleSheet, View, AsyncStorage, Image, TouchableWithoutFeedback} from 'react-native';
import ajaxWrapper from '../base/ajax.js';
import { Form, Container, Header, Title, Content, Footer, FooterTab, Left, Right, Body, Card, CheckBox, CardItem, List, ListItem, InputGroup, Input, Spinner, Item, Label, Textarea} from 'native-base';
import DateTimePicker from '../library/DateTimePicker.js';
import ButtonSelect from '../library/buttonSelect.js';
import Text from '../library/text.js';
import Button from '../localLibrary/button.js';
import {LinearGradient} from 'expo';

var close = require('../assets/settings/close.png')

class AddDoctor extends React.Component {
  constructor(props) {
      super(props);

      if (this.props.doctor) {
        var newState = this.props.doctor;
        newState['loaded'] = true;
        if (newState['next_appointment'] == null) {
          newState['next_appointment'] = '';
        }
        else {
          var split = newState['next_appointment'].split('-');
          var months = ['January','February','March','April','May','June','July','August','September','October','November','December']
          var date = months[parseInt(split[2]) - 1] + ' ' + split[1] + ' ' + split[0];
          newState['next_appointment'] = date;
        }

        this.state = newState;
        console.log("Doctor", this.props.doctor)
      }
      else {
        this.state = {'name' : '', 'type' : '', 'email':'', 'phone': '', 'next_appointment':'', 'reminder':'', 'id':null, loaded:true};
      }

      this.handleChange = this.handleChange.bind(this);
      this.save = this.save.bind(this);
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
          newState[name] = value;
        }

        console.log("New State", newState)
        var newCompleteState = this.state;
        newCompleteState[name] = value;
        this.setState(newState);
    }


    save() {
      var submitUrl = '/api/home/doctor/';
      if (this.state.id != null) {
        submitUrl += this.state.id + '/'
      }
      var data = this.state;
      if (data['next_appointment'] != '') {
        var split = data['next_appointment'].split(' ')
        var months = ['January','February','March','April','May','June','July','August','September','October','November','December']
        var date = split[2] + '-' + split[1] + '-' + (months.indexOf(split[0]) + 1)
        console.log("Save Date", date);
        data['next_appointment'] = date;
      }
      data['user'] = this.props.userId;
      ajaxWrapper('POST',submitUrl, data, () => this.props.setGlobalState('page','doctors'))
    }

    render() {


        if (this.state.loaded) {
          //name
          var name = <View style={{'flexDirection':'row', borderBottomWidth:1, borderColor:'#bbb', height:'10%'}}><Text style={{color:'#6bc8b3'}}>Name:</Text><Input style={{color:'#a657a1', height:'100%', 'fontFamily':'Quicksand'}} onChangeText={(text) => this.handleChange('name',text)} value={this.state.name} /></View>;

          //type
          var type = <View style={{'flexDirection':'row', borderBottomWidth:1, borderColor:'#bbb', height:'10%'}}><Text style={{color:'#6bc8b3'}}>Type:</Text><Input style={{color:'#a657a1', 'fontFamily':'Quicksand', height:'100%'}} onChangeText={(text) => this.handleChange('type',text)} value={this.state.type} /></View>;

          //email
          var email = <View style={{'flexDirection':'row', borderBottomWidth:1, borderColor:'#bbb', height:'10%'}}><Text style={{color:'#6bc8b3'}}>Email:</Text><Input style={{color:'#a657a1', 'fontFamily':'Quicksand', height:'100%'}} onChangeText={(text) => this.handleChange('email',text)} value={this.state.email} /></View>;

          //phone
          var phone = <View style={{'flexDirection':'row', borderBottomWidth:1, borderColor:'#bbb', height:'10%'}}><Text style={{color:'#6bc8b3'}}>Phone:</Text><Input style={{color:'#a657a1', 'fontFamily':'Quicksand', height:'100%'}} onChangeText={(text) => this.handleChange('phone',text)} value={this.state.phone} /></View>;

          //notes
          var notes = <View><Text style={{color:'#6bc8b3'}}>Notes:</Text><Textarea style={{'width':'100%', color:'#a657a1', 'fontFamily':'Quicksand'}} onChangeText={(text) => this.handleChange('notes',text)} value={this.state.notes} rowSpan={3} /></View>;

          //next_appointment
          var next_appointment = <DateTimePicker name={'next_appointment'} answer={this.state.next_appointment} handleChange={this.handleChange} date={true} />;

          // reminder
          var reminder_options = [true,false];

          var pickerItems = [];
          for (var index in reminder_options) {
            var value = reminder_options[index];
            pickerItems.push(<ButtonSelect answer={this.state.reminder} handleChange={this.handleChange} name={'reminder'} value={value}/>)
          }

          var reminder = <View>
            {pickerItems}
          </View>;

          var save = <Button text={'Save'} onPress={this.save} selected={true} />
          if (this.state.id) {
            save = <Button text={'Edit'} onPress={this.save} />
          }

          return (
          <View>
          <LinearGradient
            colors={['#52bfa6', '#3e8797']}
            style={{alignItems: 'center', 'height':'100%', 'width':'100%', 'height':'100%'}}>

          <Text style={{'color':'white', marginTop: 20}}>m    y        h    e    a    l    t    h</Text>

          <View style={{'alignItems':'center', justifyContent:'center', 'width':'100%'}}>

            <View style={{'backgroundColor': 'white', width:'80%', 'padding':10, borderTopLeftRadius: 25, borderTopRightRadius: 25}} >
              <Text style={{'color':'#a657a2', 'textAlign':'center', width:'100%'}}>{this.state.name + '\n' + this.state.type}</Text>
            </View>

            <LinearGradient colors={['#bbb','#fff','#fff']} style={{'backgroundColor': 'white', 'width':'80%', height:'70%', 'padding':20, alignItems:'center', 'justifyContent':'center', borderBottomLeftRadius: 25, borderBottomRightRadius: 25, flexDirection: 'row', flexWrap: 'wrap'}}>
              <View style={{flexDirection: 'column', height:'75%', width:'100%'}}>
                {name}
                {type}
                {phone}
                {email}
                {notes}
                </View>
                {save}
            </LinearGradient>

            <TouchableWithoutFeedback onPress={() => this.props.setGlobalState('page','doctors')} style={{'alignItems':'center', justifyContent:'center', flex: 1}}>
              <View style={{'textAlign':'center', 'position':'absolute','bottom':'7%', 'height':50, width:50, borderRadius:50, backgroundColor: 'white', zIndex:100}}>
                <Image source={close} style={{width: 50,height:50}} resizeMode="contain" />
              </View>
            </TouchableWithoutFeedback>
          </View>

          </LinearGradient>
          </View>
          );

        }
        else {
          return (
            <View>
                  <Text>Welcome To Doctors</Text>
              </View>
          );
        }

    }
}

export default AddDoctor;
