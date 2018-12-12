import React, { Component } from 'react';
import {
    Alert,
    Button,
    KeyboardAvoidingView,
    Image,
    StyleSheet,
    TouchableHighlight,
    View,
    ScrollView,
    Text
} from 'react-native';
import Auth0 from 'react-native-auth0';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import {LinearGradient} from 'expo';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import ajaxWrapper from '../../../base/ajax.js';
const Keyboard = require('Keyboard');
import { Permissions, Notifications } from 'expo';
import ResetPasswordForm from './ResetPasswordForm.js';

var credentials = require('../auth0-credentials');
const auth0 = new Auth0(credentials);

var logo = require('../../../assets/Norma_2.png')

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = { viewLogin: true, keyboard: false, resetPassword: false };
        this.realmLogin = this.realmLogin.bind(this);
        this.createUser = this.createUser.bind(this);
        this.redirect = this.redirect.bind(this);
        this.resetPassword = this.resetPassword.bind(this);
        this.reset = this.reset.bind(this);
    }

    componentDidMount() {
      Keyboard.addListener('keyboardWillShow', () => this.setState({'keyboard':true}))
    }
    componentWillMount () {
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this.keyboardDidShow.bind(this))
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this.keyboardDidHide.bind(this))
  }

  componentWillUnmount () {
    this.keyboardDidShowListener.remove()
    this.keyboardDidHideListener.remove()
  }

  keyboardDidShow() {
    console.log("Keyboard Did Show");
    this.setState({'keyboard':true})
  }

  keyboardDidHide() {
    console.log("Keyboard Did Hide");
    this.setState({keyboard: false})
  }

    onSuccess(credentials) {
        auth0.auth
            .userInfo({ token: credentials.accessToken })
            .then(profile => {
                this.props.onAuth(credentials, profile);
            })
            .catch(error => console.log("Error", error));
    }

    alert(title, message) {
        Alert.alert(
            title,
            message,
            [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
            { cancelable: false }
        );
    }

    resetPassword(username) {
      auth0.auth
          .resetPassword({
              email: username,
              connection: 'Username-Password-Authentication',
          })
          .then(
              this.alert("Password Reset Email Sent", "An Email Has Been Sent To You In Order To Reset Your Password.")
          )
          .catch(error => this.alert('Error', error.json.error_description));
    }

    reset() {
      this.setState({'resetPassword':!this.state.resetPassword})
    }

    realmLogin(username, password) {
        auth0.auth
            .passwordRealm({
                username: username,
                password: password,
                realm: 'Username-Password-Authentication',
                scope: 'openid profile email',
                audience: 'https://' + credentials.domain + '/userinfo'
            })
            .then(credentials => {
                this.onSuccess(credentials);
            })
            .catch(error => this.alert('Error', error.json.error_description));
    }

    createUser(username, password, name) {
        auth0.auth
            .createUser({
                email: username,
                password: password,
                connection: 'Username-Password-Authentication',
            })
            .then(success => {
                console.log(success)
                this.props.setGlobalState('userId', success["Id"])
                this.props.setGlobalState('email', success["email"])

                this.registerForPushNotifications(success["Id"], name)
                this.realmLogin(username,password);


            })
            .catch(error => {
                this.alert('Error', error.json.description)
            });
    }

    async registerForPushNotifications(user, name) {
      const { status } = await Permissions.getAsync(Permissions.NOTIFICATIONS);

      console.log("Status", status)

      if (status !== 'granted') {
        const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
        if (status !== 'granted') {
          return;
        }
      }
      console.log("Here");
      const token = await Notifications.getExpoPushTokenAsync();
      console.log("Token", token)

      this.subscription = Notifications.addListener(this.handleNotification);
      ajaxWrapper("POST","/api/home/usersettings/", {"user": user, "notifications_token":token, name:name}, this.redirect)

    }

    redirect(result) {
      console.log("Result", result)
      var settings_id = result[0]['usersettings']['id']
      this.props.setGlobalState("settings_id", settings_id)
    }

    webAuth(connection) {
        auth0.webAuth
            .authorize({
                scope: 'openid profile email',
                connection: connection,
                audience: 'https://' + credentials.domain + '/userinfo'
            })
            .then(credentials => {
                this.onSuccess(credentials);
            })
            .catch(error => console.log(error));
    };

    render() {
        let form = null;
        if (this.state.resetPassword) {
          form = <ResetPasswordForm resetPassword={this.resetPassword} reset={this.reset}/>;
        }
        else if (this.props.login) {
            form = <LoginForm webAuth={this.webAuth} realmLogin={this.realmLogin} reset={this.reset} />;
        } else {
            form = <SignupForm webAuth={this.webAuth} alert={this.alert} createUser={this.createUser} />;
        }

        var image = <Image source={logo} style={{width:'60%', 'height':'20%', marginTop:'15%'}} />




        if (this.state.keyboard) {
          image = null;
        }




        return (
          <View style={{width:'100%', height:'100%'}} behavior="height">
            <LinearGradient
              colors={['#bd83b9', '#7d5d9b']}
              style={{alignItems: 'center', justifyContent:'center', 'height':'100%', 'width':'100%'}}>

                {image}


                <View style={styles.formContainer}>
                    {form}
                </View>

                <Text style={{padding:10, borderColor:'#fff', borderBottomWidth:2, color:'#fff', fontFamily:'Quicksand'}}>Data Agreement</Text>


                </LinearGradient>
                <KeyboardSpacer />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff'
    },
    formContainer: {
        flex: 2,
        width:'100%',
        alignItems:'center',
        justifyContent:'center',
    },
    headerContainer: {
        flex: 1,
        marginTop: 20,
        alignItems: 'center',
        backgroundColor: '#eeeeee',
        justifyContent: 'center',
    },
    socialContainer: {
        width: '80%',
        height:'10%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    tabContainer: {
        flex: 0.5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        borderRadius: 1,
        borderWidth: 0.5,
        borderColor: '#d6d7da',
    },
    title: {
        marginTop: 10,
        width: 100,
        textAlign: 'center',
        fontSize: 16
    },
    socialIcon: {
        margin: 10,
    }
});
