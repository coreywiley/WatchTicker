import React from 'react';
import { StyleSheet, View, AsyncStorage, Image, TouchableWithoutFeedback} from 'react-native';
import ajaxWrapper from '../base/ajax.js';
import { Form, Container, Header, Title, Content, Footer, FooterTab, Left, Right, Body, Card, CheckBox, CardItem, List, ListItem, InputGroup, Input, Spinner, Item, Label, Textarea} from 'native-base';
import DateTimePicker from '../library/DateTimePicker.js';
import ButtonSelect from '../library/buttonSelect.js';
import Text from '../library/text.js';
import Button from '../localLibrary/button.js';
import {LinearGradient} from 'expo';
import Auth0 from 'react-native-auth0';
import Loading from '../library/loading.js';
var credentials = require('./app/auth0-credentials');
const auth0 = new Auth0(credentials);

var close = require('../assets/settings/close.png');

class Edit extends React.Component {
  constructor(props) {
      super(props);

      this.state = {'name':this.props.name, value:this.props.settings_value, value2:'', value3:'', loaded:true}
      this.save = this.save.bind(this)
  }


    handleChange(name,value) {
        var newState = {};
        newState[name] = value;

        this.setState(newState);
    }


    save() {
      if (this.props.name == 'name') {
        ajaxWrapper('POST','/api/home/usersettings/' + this.props.user_settings_id + '/', {name:this.state.value}, () => this.props.setGlobalState('page','settings'))
      }
      if (this.props.name == 'email') {
        auth0.users
            .patchUser({ id: this.props.userId, email: this.state.value, username:this.state.value })
            .then(profile => {
                this.props.setGlobalState('email', this.state.value);
                this.props.setGlobalState('page','settings')
            })
            .catch(error => console.log("Error", error));
      }
      var submitUrl = '/api/home/doctor/';
      //ajaxWrapper('POST',submitUrl, data, () => this.props.setGlobalState('page','doctors'))
    }

    render() {


        if (this.state.loaded) {
          //name
          var form_fields = [];

          if (this.props.name == 'name') {
            form_fields.push(<View style={{alignItems:'center', justifyContent:'center', width:'80%', borderBottomWidth:2, borderColor:'#bbb', height:50}}><Input style={{color:'#a657a1', 'fontFamily':'Quicksand', width:'100%', textAlign:'center'}} onChangeText={(text) => this.handleChange('value',text)} value={this.state.value} /></View>)
          }
          else if (this.props.name == 'email') {
            form_fields.push(<View style={{alignItems:'center', justifyContent:'center', width:'80%', borderBottomWidth:2, borderColor:'#bbb', height:50}}><Input style={{color:'#a657a1', 'fontFamily':'Quicksand', width:'100%', textAlign:'center'}} onChangeText={(text) => this.handleChange('value',text)} value={this.state.value} /></View>)
          }
          else if (this.props.name == 'password') {
            form_fields.push(<View style={{alignItems:'center', justifyContent:'center', width:'80%', borderBottomWidth:2, borderColor:'#bbb', height:50}}><Input style={{color:'#a657a1', 'fontFamily':'Quicksand', width:'100%', textAlign:'center'}} onChangeText={(text) => this.handleChange('value',text)} value={this.state.value} placeholder={'Old Password'} placeholderTextColor={'#bbb'} secureTextEntry={true} /></View>)
            form_fields.push(<View style={{alignItems:'center', justifyContent:'center', width:'80%', borderBottomWidth:2, borderColor:'#bbb', height:50}}><Input style={{color:'#a657a1', 'fontFamily':'Quicksand', width:'100%', textAlign:'center'}} onChangeText={(text) => this.handleChange('value',text)} value={this.state.value2} placeholder={'New Password'} placeholderTextColor={'#bbb'} secureTextEntry={true} /></View>)
            form_fields.push(<View style={{alignItems:'center', justifyContent:'center', width:'80%', borderBottomWidth:2, borderColor:'#bbb', height:50}}><Input style={{color:'#a657a1', 'fontFamily':'Quicksand', width:'100%', textAlign:'center'}} onChangeText={(text) => this.handleChange('value',text)} value={this.state.value3} placeholder={'Retype New Password'} placeholderTextColor={'#bbb'} secureTextEntry={true} /></View>)

          }


          // reminder


          var save = <View style={{marginBottom:'10%'}}><Button text={'Save'} onPress={this.save} selected={true} /></View>

          return (
          <View>
          <LinearGradient
            colors={['#52bfa6', '#3e8797']}
            style={{alignItems: 'center', 'height':'100%', 'width':'100%'}}>

          <View style={{'alignItems':'center', justifyContent:'center', 'width':'100%', height:'50%', marginTop:'20%'}}>
            <View style={{alignItems:'center',justifyContent:'center', width:'80%', backgroundColor:'white', borderRadius:25}}>
              <View style={{flexDirection: 'column', height:'75%', width:'100%', alignItems:'center', justifyContent:'center'}}>
                <Text style={{color:'#6bc8b3', marginTop:50}}>Edit {this.state.name}</Text>
                {form_fields}
                </View>
                {save}

                <TouchableWithoutFeedback onPress={() => this.props.setGlobalState('page','settings')} style={{'alignItems':'center', justifyContent:'center', flex: 1}}>
                  <View style={{'textAlign':'center', 'position':'absolute','top':20, right:20, 'height':50, width:50, borderRadius:50, backgroundColor: 'white', zIndex:100}}>
                    <Image source={close} style={{width: 50,height:50}} resizeMode="contain" />
                  </View>
                </TouchableWithoutFeedback>

            </View>


          </View>

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

export default Edit;
