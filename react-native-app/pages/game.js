import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Modal, TouchableHighlight } from 'react-native';
import { H2, Toast, Container, Header, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Text, Card, CheckBox, CardItem, List, ListItem, InputGroup, Input, Spinner, Item, Label } from 'native-base';
import ajaxWrapper from '../base/ajax.js';
import Scorecard from '../localLibrary/scorecard.js';
import { Table, Row, Rows } from 'react-native-table-component';
import GameScorecards from './gameScorecard.js';

class Game extends Component {
  constructor(props) {
    super(props);
    this.state = {
      teeTime: undefined,
      allPlayers: undefined,
    }
    this.prepareScorecards = this.prepareScorecards.bind(this);
  }

  componentDidMount() {
    ajaxWrapper('GET','/api/home/teetime/?game=' + this.props.game.id + '&teetimePlayers__user=' + this.props.userId + '&related=teetimePlayers,teetimePlayers__user',{},this.prepareScorecards)
  }

  prepareScorecards(result) {
    console.log("Prepare Scorecard",result)
    teeTime = result[0]['teetime']
    allPlayers = {}
    for (var index in teeTime['teetimePlayers']) {
      player = teeTime['teetimePlayers'][index]['teetimeplayer']
      allPlayers[player.user.id] = player
    }
    console.log("allPlayers")
    this.setState({teeTime:teeTime, allPlayers:allPlayers})
  }

  render() {
    console.log("League Props", this.props.league)
    owner = this.props.league.owner;
    if (this.state.teeTime) {
      return (
          <Content>
          <H2>Your Game</H2>
          <Scorecard teetime={this.state.teeTime} league={this.props.league} game={this.props.game} editable={true} players={this.state.allPlayers} />
          <H2>League Games</H2>
          <GameScorecards game={this.props.game} editable={owner} league={this.props.league} />
          </Content>
      )
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

export default Game;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff' },
  head: { height: 40, backgroundColor: '#f1f8ff' },
  text: { margin: 6 }
});
