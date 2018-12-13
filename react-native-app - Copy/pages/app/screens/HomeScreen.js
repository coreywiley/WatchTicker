import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Image
} from 'react-native';
import LoginModal from '../modals/LoginModal'
import {LinearGradient} from 'expo';
import Button from '../../../localLibrary/button.js';
import ajaxWrapper from '../../../base/ajax.js';

var logo = require('../../../assets/Norma_1.png')

export default class HomeScreen extends React.Component {
    constructor(props) {
      super(props);
      this.state = { modalVisible: false, login: true };
      this.onAuth = this.onAuth.bind(this)
      this.redirect = this.redirect.bind(this);
    }

    static navigationOptions = {
      title: 'Home',
      headerLeft: false
    };

    onAuth = (credentials, profile) => {
      this.setState({modalVisible: false}, () =>
      console.log("Credentials", {credentials: credentials, profile: profile}))
      var dirtyId = profile['sub'];
      var clean_id = dirtyId.substring(dirtyId.indexOf("|") + 1);
      this.props.setGlobalState('userId', clean_id)
      this.props.setGlobalState('email', profile["email"])
      this.props.setGlobalState('accessToken', credentials['accessToken'])
      ajaxWrapper('GET','/api/home/usersettings/?user=' + clean_id, {}, this.redirect)
    };

    redirect(result) {
      this.props.setGlobalState("settings_id", result[0]['usersettings']['id'])
      this.props.setGlobalState('page','onboarding')
    }

    render() {

      return (
        <View style={styles.container}>
        <LinearGradient
          colors={['#bd83b9', '#7d5d9b']}
          style={{alignItems: 'center', 'height':'100%', 'width':'100%'}}>

            <Image source={logo} style={{width:'60%', 'height':'23%', marginTop:'25%'}} />

            <View style={{marginTop:'50%', width:'100%'}} />

            <Button
              onPress={() => this.setState({modalVisible: true, login:true})}
              text="Log In"
            />

            <Button
              onPress={() => this.setState({modalVisible: true, login:false})}
              text="Create Account"
            />

            <LoginModal setGlobalState={this.props.setGlobalState} login={this.state.login} modalVisible={this.state.modalVisible} onAuth={this.onAuth}/>
          </LinearGradient>
        </View>
      );
    }
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center'
    }
  });
