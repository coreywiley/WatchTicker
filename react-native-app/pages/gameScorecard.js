import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Modal, TouchableHighlight } from 'react-native';
import { H2, Toast, Container, Header, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Text, Card, CheckBox, CardItem, List, ListItem, InputGroup, Input, Spinner, Item, Label } from 'native-base';
import ajaxWrapper from '../base/ajax.js';
import Scorecard from '../localLibrary/scorecard.js';
import { Table, Row, Rows } from 'react-native-table-component';

class GameScorecards extends Component {
  constructor(props) {
    super(props);
    this.state = {
      teeTimes: undefined,
    }
    this.prepareScorecards = this.prepareScorecards.bind(this);
  }

  componentDidMount() {
    ajaxWrapper('GET','/api/home/teetime/?game=' + this.props.game.id + '&related=teetimePlayers,teetimePlayers__user',{},this.prepareScorecards)
  }

  prepareScorecards(result) {
    console.log("Prepare Scorecard",result)
    teeTimes = []
    for (var i in result) {
      teeTime = result[0]['teetime']
      allPlayers = {}
      for (var index in teeTime['teetimePlayers']) {
        player = teeTime['teetimePlayers'][index]['teetimeplayer']
        allPlayers[player.user.id] = player
      }
      teeTime['players'] = allPlayers;
      teeTimes.push(teeTime)
    }
    this.setState({teeTimes:teeTimes})
  }

  render() {

    if (this.state.teeTimes) {
      scorecards = [];
      for (var index in this.state.teeTimes) {
        scorecards.push(<Scorecard teetime={this.state.teeTimes[index]} league={this.props.league} game={this.props.game} editable={this.props.editable} players={this.state.teeTimes[index].players} />);
      }
      return (
        <Content>
          {scorecards}
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

export default GameScorecards;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff' },
  head: { height: 40, backgroundColor: '#f1f8ff' },
  text: { margin: 6 }
});
