import React from 'react';
import { StyleSheet, View, ScrollView, Image, TouchableWithoutFeedback, Linking } from 'react-native';
import ajaxWrapper from '../base/ajax.js';
import { Toast, Container, Header, Title, Content, FooterTab, Left, Right, Body, Card, CheckBox, CardItem, List, ListItem, InputGroup, Input, Spinner, Textarea } from 'native-base';
import CMCard from '../library/card.js';
import Button from '../localLibrary/button.js';
import {LinearGradient} from 'expo';
import Text from '../library/text.js';
import Footer from '../localLibrary/footer.js';
import Loading from '../library/loading.js';

var off = require('../assets/health/switch_off.png')
var on = require('../assets/health/switch_on.png')
var close = require('../assets/settings/close.png')

class Settings extends React.Component {
  constructor(props) {
        super(props);
        this.state = {
          name: '',
          email: this.props.email,
          breast_exam_reminders: true,
          email_newsletters: true,
          loaded:false,
          delete:false,
        };

        this.edit = this.edit.bind(this);
        this.settingsCallback = this.settingsCallback.bind(this);
        this.serverSync = this.serverSync.bind(this);

      }

      serverSync() {
        ajaxWrapper('GET','/api/home/usersettings/?user=' + this.props.userId,{},this.settingsCallback)
      }

      componentDidMount() {
        this.serverSync();
      }

      settingsCallback(result) {
        var usersettings = result[0]['usersettings'];
        usersettings['loaded'] = true
        this.setState(usersettings)
      }

      edit(name) {
        this.props.setGlobalState('settings_edit',name)
        this.props.setGlobalState('settings_value',this.state[name])
        this.props.setGlobalState('user_settings_id',this.state.id)
        this.props.setGlobalState('page','edit')
      }

      changeNotification(type) {
        var newState = {};
        newState[type] = !this.state[type]
        ajaxWrapper('POST','/api/home/usersettings/' + this.state.id + '/', newState, this.serverSync)
      }

    render() {

      if (this.state.loaded == false) {
        return (
          <Loading />
        );
      }


      else {
        if (this.state.delete) {
          return (

            <View>
            <LinearGradient
              colors={['#bd83b9', '#7d5d9b']}
              style={{alignItems: 'center', 'height':'100%', 'width':'100%'}}>

            <Text style={{color:'white', marginTop:'30%', textAlign:'center', width:'80%'}}>Are you sure you want to delete your profile? It won't be recoverable.</Text>
              <View style={{'marginTop':'10%'}} />
              <Button selected={true} width={'80%'} onPress={() => this.setState({'delete':false})} text={"No, Don't Delete My Profile Forever"} />
              <View style={{'marginTop':'10%'}} />
              <Button width={'80%'} onPress={() => this.setState({'delete':false})} text={"Yes, Delete My Profile"} />

            </LinearGradient>
            </View>

          )
        }
        else {
          var breast_exam_reminders = off;
          if (this.state.breast_exam_reminders) {
            breast_exam_reminders = on;
          }
          var email_newsletters = off;
          if (this.state.email_newsletters) {
            email_newsletters = on;
          }


        return (
          <View>
            <View style={{width:'100%', backgroundColor: '#e6d8e8'}}>
              <Text style={{color:'#a657a1', margin:10,fontSize: 12}}>ACCOUNT</Text>
            </View>

            <View style={{width:'95%', borderBottomWidth:2, borderColor: '#bbb', marginLeft:10}}>
              <Text style={{color:'#a657a1', margin:10}}>{this.state.name}</Text>

              <View style={{position:'absolute', right:10}}>
                <TouchableWithoutFeedback onPress={() => this.edit('name')}>
                  <Text style={{color:'#6bc8b3', margin:10}}>Edit name</Text>
                </TouchableWithoutFeedback>
              </View>
            </View>

            <View style={{width:'95%', borderBottomWidth:2, borderColor: '#bbb', marginLeft:10}}>
              <Text style={{color:'#a657a1', margin:10}}>{this.state.email}</Text>

              <View style={{position:'absolute', right:10}}>
                <TouchableWithoutFeedback onPress={() => this.edit('email')}>
                  <Text style={{color:'#6bc8b3', margin:10}}>Edit email</Text>
                </TouchableWithoutFeedback>
              </View>
            </View>

            <View style={{width:'95%', borderColor: '#bbb', marginLeft:10}}>
              <Text style={{color:'#a657a1', margin:10}}>Password</Text>

              <View style={{position:'absolute', right:10}}>
                <TouchableWithoutFeedback onPress={() => this.edit('password')}>
                  <Text style={{color:'#6bc8b3', margin:10}}>Change password</Text>
                </TouchableWithoutFeedback>
              </View>
            </View>

            <View style={{width:'100%', backgroundColor: '#e6d8e8',fontSize: 12}}>
              <Text style={{color:'#a657a1', margin:10,fontSize: 12}}>NOTIFICATIONS</Text>
            </View>

            <View style={{width:'95%', borderColor: '#bbb', marginLeft:10}}>
              <Text style={{color:'#a657a1', margin:10}}>Breast Self-Exam reminders</Text>

              <View style={{position:'absolute', right:10}}>
                <TouchableWithoutFeedback onPress={() => this.changeNotification('breast_exam_reminders')}>
                  <Image source={breast_exam_reminders} style={{width: 60,height:30}} resizeMode="contain" />
                </TouchableWithoutFeedback>
              </View>
            </View>

            <View style={{width:'95%', borderColor: '#bbb', marginLeft:10}}>
              <Text style={{color:'#a657a1', margin:10}}>Email newsletters</Text>

              <View style={{position:'absolute', right:10}}>
                <TouchableWithoutFeedback onPress={() => this.changeNotification('email_newsletters')}>
                  <Image source={email_newsletters} style={{width: 60,height:30}} resizeMode="contain" />
                </TouchableWithoutFeedback>
              </View>
            </View>

            <View style={{width:'100%', backgroundColor: '#e6d8e8'}}>
              <Text style={{color:'#a657a1', margin:10, fontSize: 12}}>PRIVACY AND SECURITY</Text>
            </View>

            <View style={{width:'95%', borderColor: '#bbb', marginLeft:10}}>
              <Text style={{color:'#a657a1', margin:10}}>Privacy policy</Text>

              <View style={{position:'absolute', right:10}}>
                <TouchableWithoutFeedback onPress={() => Linking.openURL("https://www.knowyournorma.com/privacy-policy")}>
                  <Text style={{color:'#6bc8b3', margin:10}}>View</Text>
                </TouchableWithoutFeedback>
              </View>
            </View>

            <View style={{width:'100%', backgroundColor: '#e6d8e8',fontSize: 12}}>
              <Text style={{color:'#a657a1', margin:10,fontSize: 12}}>CONTACT US</Text>
            </View>
            <View style={{width:'95%', borderBottomWidth:2, borderColor: '#bbb', marginLeft:10}}>
              <TouchableWithoutFeedback onPress={() => Linking.openURL('mailto:founders@knowyournorma.com?subject=Feedback')}>
                <Text style={{color:'#a657a1', margin:10}}>Send feedback</Text>
              </TouchableWithoutFeedback>
            </View>

            <View style={{alignItems:'center', justifyContent:'center'}}>
              <TouchableWithoutFeedback onPress={() => this.setState({delete:true})}>
                <Text style={{color:'#6bc8b3', fontSize: 12, borderBottomWidth:2, marginTop:30, borderColor:'#bbb'}}>DELETE ACCOUNT</Text>
              </TouchableWithoutFeedback>
            </View>

          </View>
        )
      }
    }

  }
}

//'#6bc8b3' teal
//a657a1

export default Settings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
