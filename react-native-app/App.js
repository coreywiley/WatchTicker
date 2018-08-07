import React from 'react';
import { StyleSheet, View, AsyncStorage } from 'react-native';
import { Font, AppLoading } from "expo";
import { Toast, Container, Header, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Text, CheckBox, CardItem, List, ListItem, InputGroup, Input, Spinner } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import LogIn from './pages/login.js';
import SignUp from './pages/signup.js';
import NavBar from './library/navbar.js';
import Leagues from './pages/leagues.js';
import AddLeague from './pages/addLeague.js';
import JoinLeague from './pages/joinLeague.js';
import CreateLeague from './pages/createLeague.js';
import League from './pages/league.js';
import AddGame from './pages/addGame.js';
import ManageGroups from './pages/manageGroups.js';
import Game from './pages/game.js';
import ManagePlayers from './pages/managePlayers.js';
import Stats from './pages/stats.js';
import GameScorecards from './pages/gameScorecard.js';

class App extends React.Component {
  constructor(props) {
  		super(props);
  		this.state = {
  			page: 'logIn',
        loading: true,
        league:undefined,
        userId: undefined,
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
    fetch("http://golf.jthiesen1.webfactional.com/csrfmiddlewaretoken/")
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
    else if (this.state.page == 'myLeagues') {
        header = <NavBar title={'My Leagues'} back={false} logOut={this.logOut} />;
        body = <Leagues setGlobalState={this.setGlobalState} userId={this.state.userId} />;
    }
    else if (this.state.page == 'addLeague') {
        header = <NavBar title={'Add A League'} back={true} setGlobalState={this.setGlobalState} backPage={'myLeagues'} logOut={this.logOut} />;
        body = <AddLeague setGlobalState={this.setGlobalState} />;
    }
    else if (this.state.page == 'joinLeague') {
        header = <NavBar title={'Join A League'} back={true} setGlobalState={this.setGlobalState} backPage={'addLeague'} logOut={this.logOut} />;
        body = <JoinLeague userId={this.state.userId} setGlobalState={this.setGlobalState} />;
    }
    else if (this.state.page == 'createLeague') {
        header = <NavBar title={'Create A League'} back={true} setGlobalState={this.setGlobalState} backPage={'addLeague'} logOut={this.logOut} />;
        body = <CreateLeague userId={this.state.userId} league={this.state.league} setGlobalState={this.setGlobalState} />;
    }
    else if (this.state.page == 'league') {
      console.log("User Id",this.state.userId);
        header = <NavBar title={this.state.league.name} back={true} setGlobalState={this.setGlobalState} backPage={'myLeagues'} logOut={this.logOut} />;
        body = <League league={this.state.league} userId={this.state.userId} setGlobalState={this.setGlobalState} />;
    }
    else if (this.state.page == 'addGame') {
        header = <NavBar title={'Add Game'} back={true} setGlobalState={this.setGlobalState} backPage={'league'} logOut={this.logOut} />;
        body = <AddGame league={this.state.league} userId={this.state.userId} game={this.state.game} setGlobalState={this.setGlobalState} />;
    }
    else if (this.state.page == 'manageGroups') {
        console.log("App Game Id",this.state.game, this.state.game.id);
        header = <NavBar title={'Manage Groups'} back={true} setGlobalState={this.setGlobalState} backPage={'addGame'} logOut={this.logOut} />;
        body = <ManageGroups gameId={this.state.game.id} userId={this.state.userId} league={this.state.league} setGlobalState={this.setGlobalState} />;
    }
    else if (this.state.page == 'game') {
        header = <NavBar title={'Game: League'} back={true} setGlobalState={this.setGlobalState} backPage={'league'} logOut={this.logOut} />;
        body = <Game setGlobalState={this.setGlobalState} game={this.state.game} league={this.state.league} userId={this.state.userId} />;
    }
    else if (this.state.page == 'managePlayers') {
        header = <NavBar title={'Manage Players'} back={true} setGlobalState={this.setGlobalState} backPage={'league'} logOut={this.logOut} />;
        body = <ManagePlayers league={this.state.league} userId={this.state.userId} setGlobalState={this.setGlobalState} />;
    }
    else if (this.state.page == 'stats') {
        header = <NavBar title={'League Stats'} back={true} setGlobalState={this.setGlobalState} backPage={'league'} logOut={this.logOut} />;
        body = <Stats league={this.state.league} userId={this.state.userId} setGlobalState={this.setGlobalState} />;
    }
    else if (this.state.page == 'gameStats') {
      header = <NavBar title={'Game Stats'} back={true} setGlobalState={this.setGlobalState} backPage={'stats'} logOut={this.logOut} />;
      body = <GameScorecards league={this.state.league} game={this.state.game} editable={false} userId={this.state.userId} setGlobalState={this.setGlobalState} />;
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
