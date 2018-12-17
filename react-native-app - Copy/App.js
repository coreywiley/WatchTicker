import React from 'react';
import { StyleSheet, View, AsyncStorage } from 'react-native';
import { Font, AppLoading } from "expo";
import { Toast, Container, Header, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Text, CheckBox, CardItem, List, ListItem, InputGroup, Input, Spinner } from 'native-base';
import LogIn from './pages/scaffold/login.js';
import SignUp from './pages/scaffold/signup.js';
import NavBar from './library/navbar.js';
import OnBoarding from './pages/onboarding.js';
import Customize from './pages/customize.js';
import Doctors from './pages/doctors.js';
import AddDoctor from './pages/addDoctor.js';
import FAQs from './pages/faq.js';
import Journal from './pages/journal.js';
import JournalEntries from './pages/journalEntries.js';
import Resources from './pages/resources.js';
import RiskAssessment from './pages/riskAssessment.js';
import Settings from './pages/settings.js';
import Edit from './pages/edit.js';
import PrivacyPolicy from './pages/privacyPolicy.js';
import HomeScreen from './pages/app/screens/HomeScreen.js';
import Notifications from './pages/notificationsTest.js';
import Loading from './library/loading.js';
import SetNotification from './pages/setNotification.js';

class App extends React.Component {
  constructor(props) {
  		super(props);
  		this.state = {
  			page: 'resources',
        loading: true,
        doctor: undefined,
        journal: undefined,
        customize: undefined,
        settings_edit: 'none',
        onboardingIndex: -1,
        userId: "5c0dfb82d079623e3b028a33",
        email: "",
        settings_id:3,
        email: 'jeremy.thiesen1@gmail.com',
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
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf"),
      Quicksand: require("./assets/fonts/Quicksand.ttf"),
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
    var footer = null;
    if (this.state.page == 'logIn') {
        header = <NavBar title={'Log In'} back={false} />;
        body = <LogIn userId={this.state.userId} setGlobalState={this.setGlobalState} />;
    }
    else if (this.state.page == 'signUp') {
        header = <NavBar title={'Sign Up'} back={false} />;
        body = <SignUp csrfmiddlewaretoken={this.state.csrfmiddlewaretoken} setGlobalState={this.setGlobalState} />;
    }
    else if (this.state.page == 'onboarding') {
        body = <OnBoarding setGlobalState={this.setGlobalState} userId={this.state.userId} onboardingIndex={this.state.onboardingIndex}/>;
    }
    else if (this.state.page == 'customize') {
        body = <Customize  setGlobalState={this.setGlobalState} userId={this.state.userId} />;
    }
    else if (this.state.page == 'doctors') {
        body = <Doctors setGlobalState={this.setGlobalState} userId={this.state.userId} />;
    }
    else if (this.state.page == 'addDoctor') {
        header = <NavBar title={'Edit Doctor'} back={false} logOut={this.logOut} />;
        body = <AddDoctor setGlobalState={this.setGlobalState} userId={this.state.userId} doctor={this.state.doctor}/>;
    }
    else if (this.state.page == 'faqs') {
        header = <NavBar title={'FAQs'} backPage={'resources'} setGlobalState={this.setGlobalState} />;
        body = <FAQs setGlobalState={this.setGlobalState} userId={this.state.userId} />;
    }
    else if (this.state.page == 'journal') {
        body = <Journal setGlobalState={this.setGlobalState} userId={this.state.userId} journal={this.state.journal} customize={this.state.customize} />;
    }
    else if (this.state.page == 'journalEntries') {
        body = <JournalEntries setGlobalState={this.setGlobalState} userId={this.state.userId} />;
    }
    else if (this.state.page == 'resources') {
        body = <Resources setGlobalState={this.setGlobalState} userId={this.state.userId} />;
    }
    else if (this.state.page == 'riskAssessment') {
        header = <NavBar title={'My Risk Assessment'} backPage={'doctors'} setGlobalState={this.setGlobalState} />;
        body = <RiskAssessment setGlobalState={this.setGlobalState} userId={this.state.userId} />;
    }
    else if (this.state.page == 'settings') {
        header = <NavBar title={'s e t t i n g s'} backPage={'journalEntries'} setGlobalState={this.setGlobalState} />;
        body = <Settings setGlobalState={this.setGlobalState} userId={this.state.userId} email={this.state.email}/>;
    }
    else if (this.state.page == 'edit') {
        body = <Edit name={this.state.settings_edit} setGlobalState={this.setGlobalState} userId={this.state.userId} user_settings_id={this.state.user_settings_id} settings_value={this.state.settings_value}/>;
    }
    else if (this.state.page == 'privacyPolicy') {
        header = <NavBar title={'s e t t i n g s'} backPage={'settings'} setGlobalState={this.setGlobalState} />;
        body = <PrivacyPolicy setGlobalState={this.setGlobalState} userId={this.state.userId} />;
    }
    else if (this.state.page == 'welcome') {
        body = <HomeScreen setGlobalState={this.setGlobalState} />;
    }
    else if (this.state.page == 'notifications') {
        body = <Notifications />;
    }
    else if (this.state.page == 'setNotification') {
        body = <SetNotification appointment={this.state.appointment} userId={this.state.userId} setGlobalState={this.setGlobalState} />;
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
      <Loading />
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
