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

export default class LoginForm extends Component {
    constructor(props) {
        super(props);
        this.state = { username: "", password: "", usernameError: false, passwordError: false }
    }

    validateLogin = () => {

        usernameError = false

        if (!this.state.username.length) {
            usernameError = true
        }

        if (usernameError === false) {
            this.props.resetPassword(this.state.username)
        }
    }

    render() {
      var emailPic = email_closed
      if (this.state.username == "") {
        emailPic = email;
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

                </View>

                <TouchableOpacity onPress={this.props.reset} >
                <Text style={{padding:10, marginTop:30, borderColor:'#fff', borderBottomWidth:2, color:'#fff'}}>I remembered my password</Text>
                </TouchableOpacity>

                <View style={{width: '100%', alignItems:'center',justifyContent:'center', marginTop:'5%'}}>
                  <Button text={'Reset Password'} onPress={() => this.validateLogin()} />
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
