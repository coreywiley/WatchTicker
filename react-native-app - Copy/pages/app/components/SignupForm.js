import React, { Component } from 'react';
import {
    StyleSheet,
    TextInput,
    TouchableOpacity,
    TouchableHighlight,
    Image,
    Text,
    View
} from 'react-native';
import Button from '../../../localLibrary/button.js';

var email = require('../../../assets/Onboarding/email.png')
var email_closed = require('../../../assets/Onboarding/email_closed.png')

var password_locked = require('../../../assets/Onboarding/password_locked.png')
var password_unlocked = require('../../../assets/Onboarding/password_unlocked.png')

var profilePic = require('../../../assets/Onboarding/name.png')

export default class SignupForm extends Component {
    constructor(props) {
        super(props);
        this.state = { name:"", username: "", password: "", password_confirm:"", usernameError: false, passwordError: false }
    }

    validateSignup = () => {

        usernameError = false
        passwordError = false

        if (!this.state.name.length) {
            usernameError = true
            this.props.alert("No Name", "Please add your name before signing up.")
        }
        if (!this.state.username.length) {
            usernameError = true
            this.props.alert("No Email", "Please add your email before signing up.")
        }
        if (!this.state.password.length) {
            passwordError = true
            his.props.alert("No Email", "Please add your password before signing up.")
        }
        if (this.state.password != this.state.password_confirm) {
           this.props.alert("Passwords Don't Match", "Please adjust your passwords to match before signing up.")
        }
        else {

          this.setState({usernameError: usernameError, passwordError: passwordError})
          if (usernameError === false && passwordError === false) {
              this.props.createUser(this.state.username, this.state.password, this.state.name)
          }
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

      var password_confirmed = password_locked
      if (this.state.password == "" || this.state.password != this.state.password_confirm) {
        password_confirmed = password_unlocked;
      }


        return (
            <View style={{width:'100%',alignItems:'center',justifyContent:'center'}} behavior="height">
                <View style={{alignItems:'center', justifyContent:'center'}}>

                <View style={{borderBottomWidth:2, borderColor:'#fff', flexDirection:'row', width:'80%', paddingBottom:5}} resizeMode="contain">
                    <Image source = {profilePic} style={{marginRight:'1%', height:'100%', width:'15%'}} resizeMode="contain" />
                    <TextInput
                        placeholder="name"
                        placeholderTextColor="#fff"
                        keyboardType="email-address"
                        underlineColorAndroid='transparent'
                        autoCapitalize="none"
                        style={{width:'60%', height:'100%', color:'#fff', fontFamily:'Quicksand'}}
                        autoCorrect={false}
                        onChangeText={(text) => this.setState({ name: text.trim() })}
                    />
                  </View>
                  <View style={{borderBottomWidth:2, borderColor:'#fff', flexDirection:'row', width:'80%', paddingBottom:5, marginTop:10}} resizeMode="contain">
                      <Image source = {emailPic} style={{marginRight:'1%', height:'100%', width:'15%'}} resizeMode="contain" />
                      <TextInput
                          placeholder="email address"
                          placeholderTextColor="#fff"
                          keyboardType="email-address"
                          underlineColorAndroid='transparent'
                          autoCapitalize="none"
                          style={{width:'60%', height:'100%', color:'#fff', fontFamily:'Quicksand'}}
                          autoCorrect={false}
                          onChangeText={(text) => this.setState({ username: text.trim() })}
                      />
                    </View>
                    <View style={{borderBottomWidth:2, borderColor:'#fff', flexDirection:'row', width:'80%', paddingBottom:5, marginTop:10}} resizeMode="contain">
                        <Image source = {password} style={{marginRight:'1%', height:'100%', width:'15%'}} resizeMode="contain" />
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
                      <View style={{borderBottomWidth:2, borderColor:'#fff', flexDirection:'row', width:'80%', paddingBottom:5, marginTop:10}} resizeMode="contain">
                          <Image source = {password_confirmed} style={{marginRight:'1%', height:'100%', width:'15%'}} resizeMode="contain" />
                          <TextInput
                              placeholder="retype password"
                              placeholderTextColor="#fff"
                              secureTextEntry
                              underlineColorAndroid='transparent'
                              returnKeyType="go"
                              autoCapitalize="none"
                              style={{width:'60%', height:'100%', color:'#fff', fontFamily:'Quicksand'}}
                              autoCorrect={false}
                              ref={(input) => this.passwordInput = input}
                              onChangeText={(text) => this.setState({ password_confirm: text.trim() })}
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


                <Button text={'Join Norma'} onPress={() => this.validateSignup()} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    inputContainer: {
        flex: 3,
        flexDirection: 'column',
        paddingLeft: 20,
        paddingRight: 20
    },
    input: {
        height: 50,
        backgroundColor: '#FFFFFF',
        marginBottom: 15,
        color: '#333333',
        paddingHorizontal: 10,
        borderColor: '#eaeaea',
        borderWidth: 1.0
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
