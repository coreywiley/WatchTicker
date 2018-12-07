import React from 'react';
import { StyleSheet, View, ScrollView, Image, TouchableWithoutFeedback, Linking } from 'react-native';
import ajaxWrapper from '../base/ajax.js';
import { Toast, Container, Header, Title, Content, FooterTab, Left, Right, Body, Card, CheckBox, CardItem, List, ListItem, InputGroup, Input, Spinner, Textarea } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import CMCard from '../library/card.js';
import Button from '../localLibrary/button.js';
import {LinearGradient} from 'expo';
import Text from '../library/text.js';
import Footer from '../localLibrary/footer.js';

var off = require('../assets/health/switch_off.png')
var on = require('../assets/health/switch_on.png')
var close = require('../assets/settings/close.png')

class Settings extends React.Component {
  constructor(props) {
        super(props);
        this.state = {
          name: 'Jeremy',
          email: 'jeremy.thiesen1@gmail.com',
          breast_exam_reminders: true,
          email_newsletters: false,
          loaded:true,
        };

        this.edit = this.edit.bind(this);
      }

      edit(name) {
        this.props.setGlobalState('settings_edit',name)
        this.props.setGlobalState('page','edit')
      }

    render() {

      if (this.state.loaded == false) {
        return (
          <View style={styles.container}>
            <Text>Loading...</Text>
          </View>
        );
      }


      else {

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
              <TouchableWithoutFeedback onPress={() => this.setState({edit:'password'})}>
                <Image source={off} style={{width: 60,height:30}} resizeMode="contain" />
              </TouchableWithoutFeedback>
            </View>
          </View>

          <View style={{width:'95%', borderColor: '#bbb', marginLeft:10}}>
            <Text style={{color:'#a657a1', margin:10}}>Email newsletters</Text>

            <View style={{position:'absolute', right:10}}>
              <TouchableWithoutFeedback onPress={() => this.setState({edit:'password'})}>
                <Image source={on} style={{width: 60,height:30}} resizeMode="contain" />
              </TouchableWithoutFeedback>
            </View>
          </View>

          <View style={{width:'100%', backgroundColor: '#e6d8e8'}}>
            <Text style={{color:'#a657a1', margin:10, fontSize: 12}}>PRIVACY AND SECURITY</Text>
          </View>

          <View style={{width:'95%', borderColor: '#bbb', marginLeft:10}}>
            <Text style={{color:'#a657a1', margin:10}}>Privacy policy</Text>

            <View style={{position:'absolute', right:10}}>
              <TouchableWithoutFeedback onPress={() => this.props.setGlobalState('page','privacyPolicy')}>
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
            <TouchableWithoutFeedback onPress={() => this.setState({edit:'feedback'})}>
              <Text style={{color:'#6bc8b3', fontSize: 12, borderBottomWidth:2, marginTop:30, borderColor:'#bbb'}}>DELETE ACCOUNT</Text>
            </TouchableWithoutFeedback>
          </View>

        </View>
      )
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
