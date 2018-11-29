import React from 'react';
import { StyleSheet, View, AsyncStorage } from 'react-native';
import { Font, AppLoading } from "expo";
import { Toast, Container, Header, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Text, CheckBox, CardItem, List, ListItem, InputGroup, Input, Spinner } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import LogIn from './pages/scaffold/login.js';
import SignUp from './pages/scaffold/signup.js';
import NavBar from './library/navbar.js';
import OnBoarding from './pages/onboarding.js';
import Customize from './pages/customize.js';

class App extends React.Component {
  constructor(props) {
  		super(props);
  		this.state = {
  			page: 'customize',
        loading: true,
        league:undefined,
        userId: 1,
        game:undefined
  		};
  		this.setGlobalState = this.setGlobalState.bind(this);
      this.saveCreds = this.saveCreds.bind(this);
      this.logOut = this.logOut.bind(this);
  	}

    async logOut() {
      await AsyncStorage.removeItem('userId')
      this.setState({'userId':undefined,'page':'logIn'})
    }

  async componentDidMount() {
    await Font.loadAsync({
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf")
    });
    var newState = {loading: false}


    const userId = await AsyncStorage.getItem('userId');
    console.log("User Id", userId)
    if (userId) {
      newState['userId'] = userId;
    }
    fetch("http://norma.jthiesen1.webfactional.com/api/csrfmiddlewaretoken/")
    .then(response => response.json().then(data => data))
    .then(result => {
        this.saveCreds(result,newState)
    })

  }

  async getCSRFToken(result) {
    var csrfmiddlewaretoken = result['csrfmiddlewaretoken']
    console.log("CSRF Token",csrfmiddlewaretoken)
    return csrfmiddlewaretoken

  }

  async saveCreds(result,newState) {
    csrfmiddlewaretoken = await this.getCSRFToken(result)
    console.log("CSRF Token 2",csrfmiddlewaretoken)
    newState['csrfmiddlewaretoken'] = csrfmiddlewaretoken;
    console.log("New State",newState)
    await AsyncStorage.setItem('csrfmiddlewaretoken',csrfmiddlewaretoken);
    this.setState(newState)

  }


      setGlobalState(item, value) {
          var newState = {}
          newState[item] = value;
          this.setState(newState);
      }

    handleChange(name,value) {
      console.log("Hello");
    }

  render() {
    var header;
    var body;
    if (this.state.page == 'logIn') {
        header = <NavBar title={'Log In'} back={false} />;
        body = <LogIn userId={this.state.userId} setGlobalState={this.setGlobalState} />;
    }
    else if (this.state.page == 'signUp') {
        header = <NavBar title={'Sign Up'} back={false} />;
        body = <SignUp csrfmiddlewaretoken={this.state.csrfmiddlewaretoken} setGlobalState={this.setGlobalState} />;
    }
    else if (this.state.page == 'onboarding') {
        header = <NavBar title={'On Boarding'} back={false} logOut={this.logOut} />;
        body = <OnBoarding setGlobalState={this.setGlobalState} userId={this.state.userId} />;
    }
    else if (this.state.page == 'customize') {
        header = <NavBar title={'Customize'} back={false} logOut={this.logOut} />;
        body = <Customize setGlobalState={this.setGlobalState} userId={this.state.userId} />;
    }


    if (this.state.loading == false) {
      return (
        <Container>
        {header}
        {body}
        </Container>

      );
    }
    else {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;
