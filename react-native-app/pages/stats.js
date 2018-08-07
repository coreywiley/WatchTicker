import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Modal, TouchableHighlight, ScrollView } from 'react-native';
import { Table, TableWrapper, Row, Cell, Rows } from 'react-native-table-component';
import { H2, Toast, Container, Header, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Text, Card, CheckBox, CardItem, List, ListItem, InputGroup, Input, Spinner, Item, Label } from 'native-base';
import ajaxWrapper from '../base/ajax.js';

class Stats extends Component {
  constructor(props) {
    super(props);

    this.state = {
      averageHeaders: ['Name', 'Average'],
      pointHeaders: ['Name','Total'],
      averageData: [['Jdawg',4,3,4,5],['Jeremy Thiesen',5,4,5,6]],
      pointData:[['Jdawg',20,8,8,4],['Jeremy Thiesen',19,7,9,3]],
      gamesList: [[1,'08-03-2018'],[2,'07-26-2018']],
      widthArr: [80,80],
      loaded: false,
    }

    this.prepTables = this.prepTables.bind(this);
    this.gameStats = this.gameStats.bind(this);
    //
  }

  componentDidMount() {
    ajaxWrapper('GET','/api/home/league/?related=games,games__scores,leaguePlayers,leaguePlayers__user&id=' + this.props.league.id, {}, this.prepTables)
  }

  prepTables(result) {
    league = result[0]['league']
    users = {}
    for (var index in league['leaguePlayers']) {
      user = league['leaguePlayers'][index]['leagueplayers']['user']
      users[user.id] = user;
    }
    pointHeaders = this.state.pointHeaders;
    averageHeaders = this.state.averageHeaders;
    widthArr = this.state.widthArr
    games = []
    scores = {}
    for (var index in league['games']) {
      game = league['games'][index]['game']
      games.push([game.id,game.date])
      gameScores = game['scores']
      scores[game.id] = {}
      console.log("Game Scores",gameScores)
      for (var index2 in gameScores) {
        score = gameScores[index2]['score']

        console.log(score.player_id);
        scores[game.id][score.player_id] = score
      }
    }

    games.sort(this.compareGames);

    averageData = []
    pointData = []
    userLoc = {}
    i = 0;
    for (var index in users) {
      userName = users[index].full_name;
      averageData.push([userName,0]);
      pointData.push([userName,0]);
      userLoc[users[index].id] = i;
      i ++;
    }

    for (var index in games) {
      game = games[index];
      averageHeaders.push(game[1]);
      pointHeaders.push(game[1]);
      widthArr.push(80)

      for (var userId in scores[game[0]]) {
        userIndex = userLoc[userId];
        averageData[userIndex].push(scores[game[0]][userId].overall_score)
        pointData[userIndex].push(scores[game[0]][userId].overall_points)
      }
    }

    for (var index in averageData) {
      totalPoints = 0
      totalScore = 0
      for (var i = 0; i < averageData[0].length-2; i++) {
        totalScore += averageData[index][i+2]
        totalPoints += pointData[index][i+2]
      }

      averageData[index][1] = totalScore/(averageData[0].length - 2);
      pointData[index][1] = totalPoints;
    }
    averageData.sort(this.compareGames);
    pointData.sort(this.compareGamesReverse);

    this.setState({games:games, averageData: averageData, pointData:pointData, averageHeaders:averageHeaders, pointHeaders:pointHeaders, loaded:true, widthArr:widthArr})
  }

  compareGames(a,b) {
    if (a[1] < b[1])
      return -1;
    if (a[1] > b[1])
      return 1;
    return 0;
  }

  compareGamesReverse(a,b) {
    if (a[1] < b[1])
      return 1;
    if (a[1] > b[1])
      return -1;
    return 0;
  }

  gameStats(id) {
    this.props.setGlobalState('game',{'id':id});
    this.props.setGlobalState('page','gameStats');
  }

  render() {

    averagetable = <Table key={'average'} borderStyle={{borderColor: 'transparent'}}>
      <Row data={this.state.averageHeaders} style={styles.head} widthArr={this.state.widthArr} textStyle={styles.text}/>
      <Rows data={this.state.averageData} widthArr={this.state.widthArr} textStyle={styles.text} />
    </Table>;

    pointTable = <Table key={'points'} borderStyle={{borderColor: 'transparent'}}>
      <Row data={this.state.pointHeaders} style={styles.head} widthArr={this.state.widthArr} textStyle={styles.text}/>
      <Rows data={this.state.pointData} widthArr={this.state.widthArr} textStyle={styles.text} />
    </Table>;

    gameButtons = [];
    for (var index in this.state.games) {
      game = this.state.games[index];
      gameButtons.push(<Button onPress={() => this.gameStats(game[0])} full><Text>{game[1]}</Text></Button>);
    }

    console.log("Game buttons length",gameButtons.length)

      if (this.state.loaded == false) {
        return (
          <View style={styles.container}>
            <Text>Loading...</Text>
          </View>
        );
      }
      else {
        return (
        <View>
          <ScrollView>
            <H2>Average Score</H2>
            <ScrollView horizontal={true}>
            {averagetable}
            </ScrollView>
            <H2>Total Points</H2>
            <ScrollView horizontal={true}>
            {pointTable}
            </ScrollView>
            <H2>View Game Details</H2>
            {gameButtons}
          </ScrollView>
        </View>
    )
  }
}
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff', flexDirection: 'row' },
  head: { height: 40, backgroundColor: '#f1f8ff' },
  text: { margin: 6 },
  row: { flexDirection: 'row', backgroundColor: '#FFF' },
  btn: { width: 58, height: 18, backgroundColor: '#78B7BB',  borderRadius: 2 },
  btnText: { textAlign: 'center', color: '#fff' }
});

export default Stats;
