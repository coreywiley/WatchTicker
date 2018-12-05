import React from 'react';
import { StyleSheet, View, AsyncStorage, Image} from 'react-native';
import ajaxWrapper from '../base/ajax.js';
import { Form, Container, Header, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Text, Card, CheckBox, CardItem, List, ListItem, InputGroup, Input, Spinner, Item, Label, Textarea} from 'native-base';
import DateTimePicker from '../library/DateTimePicker.js';
import ButtonSelect from '../library/buttonSelect.js';

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
          var name = <Item><Text>Name</Text><Input onChangeText={(text) => this.handleChange('name',text)} value={this.state.name} /></Item>;

          //type
          var type = <Item><Text>Type</Text><Input onChangeText={(text) => this.handleChange('type',text)} value={this.state.type} /></Item>;

          //email
          var email = <Item><Input onChangeText={(text) => this.handleChange('email',text)} value={this.state.email} /></Item>;

          //phone
          var phone = <Item><Input onChangeText={(text) => this.handleChange('phone',text)} value={this.state.phone} /></Item>;

          //notes
          var notes = <Item><Textarea style={{'width':'100%'}} onChangeText={(text) => this.handleChange('notes',text)} value={this.state.notes} rowSpan={3} bordered /></Item>;

          //next_appointment
          var next_appointment = <Item><DateTimePicker name={'next_appointment'} answer={this.state.next_appointment} handleChange={this.handleChange} date={true} /></Item>;

          // reminder
          var reminder_options = [true,false];

          var pickerItems = [];
          for (var index in reminder_options) {
            var value = reminder_options[index];
            pickerItems.push(<Item><ButtonSelect answer={this.state.reminder} handleChange={this.handleChange} name={'reminder'} value={value}/></Item>)
          }

          var reminder = <View>
            {pickerItems}
          </View>;

          return (
              <Content>



                    {name}

                    {type}
                    <Text>
                    {"\n"}
                    </Text>

                    <Text>Phone</Text>
                    {phone}

                    <Text>
                    {"\n"}
                    </Text>
                    <Text>Email</Text>
                    {email}

                    <Text>
                    {"\n"}
                    </Text>
                      <Text>Notes</Text>
                      {notes}

                    <Text>Next Appointment</Text>
                    {next_appointment}

                      <Text>Reminder</Text>
                      {reminder}

                  <View>
                    <Button success={true} onPress={this.save} full>
                      <Text>Save</Text>
                    </Button>
                    </View>

              </Content>
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
