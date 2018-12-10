import React, { Component } from 'react';
import {
    StyleSheet,
    TextInput,
    TouchableOpacity,
    TouchableHighlight,
    View,
    Image,
    KeyboardAvoidingView
} from 'react-native';
import Button from '../../../localLibrary/button.js';
import Text from '../../../library/text.js';

var email = require('../../../assets/Onboarding/email.png')
var email_closed = require('../../../assets/Onboarding/email_closed.png')

var password_locked = require('../../../assets/Onboarding/password_locked.png')
var password_unlocked = require('../../../assets/Onboarding/password_unlocked.png')

export default class LoginForm extends Component {
    constructor(props) {
        super(props);
        this.state = { username: "", password: "", usernameError: false, passwordError: false }
    }

    validateLogin = () => {

        usernameError = false
        passwordError = false

        if (!this.state.username.length) {
            usernameError = true
        }
        if (!this.state.password.length) {
            passwordError = true
        }
        this.setState({usernameError: usernameError, passwordError: passwordError})
        if (usernameError === false && passwordError === false) {
            this.props.realmLogin(this.state.username, this.state.password)
        }
    }

    render() {
      var emailPic = email_closed
      if (this.state.username == "") {
        emailPic = email;
      }

      var password = password_locked
      if (this.state.password == "") {
        password = password_unlocked;
      }


        return (
            <View style={{width:'100%',alignItems:'center',justifyContent:'center'}} behavior="height">
                <View>
                  <View style={{borderBottomWidth:2, borderColor:'#fff', flexDirection:'row', width:'80%', paddingBottom:5}} resizeMode="contain">
                      <Image source = {emailPic} style={{marginRight:'1%', height:'100%', width:'15%'}} resizeMode="contain" />
                      <TextInput
                          placeholder="email"
                          placeholderTextColor="#fff"
                          onSubmitEditing={() => this.passwordInput.focus()}
                          keyboardType="email-address"
                          underlineColorAndroid='transparent'
                          autoCapitalize="none"
                          style={{width:'60%', height:'100%', color:'#fff', fontFamily:'Quicksand'}}
                          autoCorrect={false}
                          onChangeText={(text) => this.setState({ username: text.trim() })}
                      />
                    </View>

                    <View style={{borderBottomWidth:2, borderColor:'#fff', flexDirection:'row', width:'80%', paddingBottom:5, marginTop:10}} resizeMode="contain">
                      <Image source = {password} style={{marginRight:'1%', height:'100%', width:'15%'}} resizeMode="contain"/>
                        <TextInput
                        placeholder="password"
                        placeholderTextColor="#fff"
                        secureTextEntry
                        underlineColorAndroid='transparent'
                        returnKeyType="go"
                        autoCapitalize="none"
                        style={{width:'60%', height:'100%', color:'#fff', fontFamily:'Quicksand'}}
                        autoCorrect={false}
                        ref={(input) => this.passwordInput = input}
                        onChangeText={(text) => this.setState({ password: text.trim() })}
                        />
                      </View>

                </View>

                <View style={{width:'100%', justifyContent:'center', alignItems:'center', flexDirection:'row', marginTop:20}} resizeMode="contain">
                    <TouchableHighlight onPress={() => this.props.webAuth('facebook')}>
                        <Image style={{margin:10, width:113, height:50}}
                          resizeMode="contain"
                          source={require('../../../assets/Onboarding/facebook.png')}
                        />
                    </TouchableHighlight>
                    <TouchableHighlight onPress={() => this.props.webAuth('google-oauth2')}>
                        <Image style={{margin:10, width:113, height:50}}
                            resizeMode="contain"
                            source={require('../../../assets/Onboarding/google.png')}
                        />
                    </TouchableHighlight>
                </View>

                <Text style={{padding:10, borderColor:'#fff', borderBottomWidth:2, color:'#fff'}}>Forgot Password?</Text>

                <View style={{width: '100%', alignItems:'center',justifyContent:'center', marginTop:'5%'}}>
                  <Button text={'Log In'} onPress={() => this.validateLogin()} />
                </View>


            </View>
        );
    }
}

const styles = StyleSheet.create({
    inputContainer: {
        flex: 3,
        flexDirection: 'column',
        paddingLeft: 20,
        paddingRight: 20,
        alignItems:'center',
        justifyContent:'center',
    },
    input: {
        width: '89%',
        color:'#fff',
    },
    inputError: {
        borderColor: '#ff0000'
    },
    buttonContainer: {
        flex: 1,
        backgroundColor: '#d34a2e',
        paddingVertical: 20,
        justifyContent: 'center'
    },
    button: {
        textAlign: 'center',
        color: '#ffffff',
        fontWeight: '400',
        fontSize: 20
    }
});
