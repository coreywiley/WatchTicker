import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Modal, TouchableHighlight, ScrollView } from 'react-native';
import { Table, TableWrapper, Row, Cell, Rows } from 'react-native-table-component';
import { H2, Toast, Container, Header, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Text, Card, CheckBox, CardItem, List, ListItem, InputGroup, Input, Spinner, Item, Label } from 'native-base';
import ajaxWrapper from '../base/ajax.js';

class Scorecard extends Component {
  constructor(props) {
    super(props);
    par = ['Par'];
    hcp = ['Handicap'];
    headers = ['ScoreId', 'Team', 'Golfer', 'Handicap']
    console.log("Game",this.props.game);
    startingHole = 1;
    if (this.props.game.holes == 'Front 9') {
      startingHole = 1;
    } else {
      startingHole = 9;
    }

    for (var i = 0; i < 11; i++) {
      holeIndex = i + startingHole;
      if (i < 9) {
        headers.push(holeIndex);
        par.push(this.props.game.course['hole' + holeIndex + '_par'])
        hcp.push(this.props.game.course['hole' + holeIndex + '_hcp'])
      }
    }

    headers.push('Score')

    this.state = {
      tableHead: headers,
      startingHole: startingHole,
      scores: {},
      displayScores: {},
      displayPoints: {},
      players: {'0':{'full_name':'None'}},
      widthArr: [0,60,100,60,40,40,40,40,40,40,40,40,40,60],
      parWidth: [220,40,40,40,40,40,40,40,40,40,60],
      pointsWidth: [220,40,40,40,40,40,40,40,40,40,60],
      modalVisible: false,
      newScore: 0,
      editable: false,
      loaded: false,
      par: par,
      hcp: hcp,
      currentCell: [0,0,this.props.teetime.id]
    }

    this.hideModal = this.hideModal.bind(this);
    this.changeScore = this.changeScore.bind(this);
    this.prepareScorecards = this.prepareScorecards.bind(this);
    this.saveScore = this.saveScore.bind(this);
    this.createScores = this.createScores.bind(this);
    this.newScore = this.newScore.bind(this);
    this.calculatePoints = this.calculatePoints.bind(this);
    this.autoScore = this.autoScore.bind(this);
  }

  componentDidMount() {
    ajaxWrapper('GET','/api/home/score/?teetime=' + this.props.teetime.id, {}, this.prepareScorecards)
  }

  prepareScorecards(result) {
    console.log("Prepare cards",result);
    console.log("Teetime Id", this.props.teetime.id);
    scores = {}
    displayScores = {}

    if (result.length == 0) {
      this.createScores()
    }
    else {

      for (var index in result) {
        score = result[index]['score'];
        scores[score.player_id] = score
        player = this.props.players[score.player_id]
        displayScore = [score.id, [player.team.toString() + player.flight,'#fff'], [player.user.full_name, '#fff'], [player.handicap,'#fff']]
        for (var i = 0; i < 9; i++) {
          holeIndex = i + this.state.startingHole;
          displayScore.push([score['hole' + holeIndex], '#fff'])
        }
        displayScore.push([score.overall_score,'#fff'])
        displayScore.push([score.overall_points,'#fff'])
        displayScores[score.player_id] = displayScore;
      }

      displayPoints = this.calculatePoints(displayScores, false);
      this.setState({scores:scores, displayScores: displayScores, displayPoints:displayPoints, loaded:true});
    }
  }

  createScores() {
    game = this.props.game.id;
    teetime = this.props.teetime.id;
    for (var index in this.props.players) {
      ajaxWrapper('POST','/api/home/score/', {'teetime':teetime, 'game':game, 'player':index}, this.newScore)
    }
  }

  newScore(result) {
    console.log(result);
    score = result[0]['score'];
    scores = this.state.scores;
    displayScores = this.state.displayScores;
    scores[score.player_id] = score
    displayScore = [score.id, ['Team','#fff'], [this.props.players[score.player_id].full_name, '#fff'], [0,'#fff']]
    for (var i = 0; i < 9; i++) {
      holeIndex = i + this.state.startingHole;
      displayScore.push([score['hole' + holeIndex], '#fff'])
    }
    displayScore.push([score.overall_score,'#fff'])
    displayScore.push([score.overall_points,'#fff'])
    displayScores[score.player_id] = displayScore;
    this.setState({displayScores:displayScores, scores:scores,loaded:true})
  }

  changeScore(playerId, holeIndex, teeTimeId) {
    this.setState({modalVisible:true, currentCell: [playerId.toString(), holeIndex, teeTimeId]})
  }

  hideModal() {
    this.setState({modalVisible:false})
  }

  saveScore(auto=false) {
    //set score
    console.log("Here")

    if (auto == false) {
      console.log("Auto",auto);
      holeScore = this.state.newScore
    }
    else {
      console.log("Auto Else",auto);
      handicap = this.state.displayScores[this.state.currentCell[0]][3][0]
      holeIndex = this.state.currentCell[1] - 4 + this.state.startingHole;
      difficulty = this.state.hcp[holeIndex]
      par = this.state.par[holeIndex]
      holeScore = this.autoScore(handicap, difficulty, par)
    }

    console.log("New Score", holeScore)

    scores = this.state.displayScores;
    displayScore = this.state.displayScores[this.state.currentCell[0]]
    displayScore[this.state.currentCell[1]] = [holeScore, '#fff']
    holeIndex = this.state.currentCell[1] - 4 + this.state.startingHole;
    displayScore[13] = [parseInt(displayScore[4][0]) + parseInt(displayScore[5][0]) + parseInt(displayScore[6][0]) + parseInt(displayScore[7][0]) + parseInt(displayScore[8][0]) + parseInt(displayScore[9][0]) + parseInt(displayScore[10][0]) + parseInt(displayScore[11][0]) + parseInt(displayScore[12][0]), '#fff']
    scores[this.state.currentCell[0]] = displayScore

    displayPoints = this.calculatePoints(scores, true);

    data = {}
    data['hole' + holeIndex] = parseInt(holeScore);

    ajaxWrapper('POST','/api/home/score/' + displayScore[0] + '/', data, console.log)
    this.setState({displayScores:scores, displayPoints:displayPoints, modalVisible:false})
  }


  handleChange(name,value) {
      var newState = {};
      newState[name] = value;
      var newCompleteState = this.state;
      newCompleteState[name] = value;
      this.setState(newState);
  }

  calculatePoints(displayScores, edit) {
    points = {}
    flights = {}
    teams = {}
    for (var player in this.props.players) {
      points[player] = [this.props.players[player].user.full_name + ' ' + this.props.players[player].team + this.props.players[player].flight, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      if (!flights[this.props.players[player].flight]) {
        flights[this.props.players[player].flight] = [];
      }
      flights[this.props.players[player].flight].push(player)
      if (!teams[this.props.players[player].team]) {
        teams[this.props.players[player].team] = [];
      }
      teams[this.props.players[player].team].push(player)
    }

    tempPoints = {}
    for (hole = 1; hole <= 9; hole++) {
      winners = []
      bestScore = 10
      num_points = 2;
      for (var index in flights) {
        flight = flights[index];
        for (var index2 in flight) {
          playerId = flight[index2];
          player = this.props.players[playerId]
          console.log("League",this.props.league);
          score = this.realScore(player.handicap, this.props.league.handicap_pct, this.state.hcp[hole], displayScores[playerId][hole+3][0])
          if (score < bestScore) {
            bestScore = score
            winners = [playerId]
            num_points = 2;
          }
          else if (score == bestScore) {
            winners.push(playerId)
            num_points = 1;
          }


        }
        if (bestScore <= 0) {
          num_points = 0;
        }
        for (var win in winners) {
          winner = this.props.players[winners[win]]
          team = winner.team
          for (var t in teams[team]) {
            points[teams[team][t]][hole] += num_points
          }
        }
      }
    }

    for (var playerId in points) {
      total_points = 0
      for (var i = 1; i < 10; i++) {
        total_points += points[playerId][i];
      }
      points[playerId][10] = total_points;
      if (edit == true) {
        ajaxWrapper('POST','/api/home/score/' + displayScores[playerId][0] + '/', {'overall_points':total_points}, console.log)
      }
    }

    return points;
  }

  autoScore(handicap, difficulty, par) {
    console.log("Auto Score",handicap, difficulty, par)
    used_handicap = handicap + 5
    numberNines = Math.floor(used_handicap/9)
    remainder = used_handicap % 9;
    if (difficulty <= remainder) {
      numberNines += 1;
    }
    return par + numberNines;
  }

  realScore(handicap, handicap_modifier, difficulty,score) {
    used_handicap = Math.round(handicap*handicap_modifier/100);
    numberNines = Math.floor(used_handicap/9)
    remainder = used_handicap % 9;
    if (difficulty <= remainder) {
      numberNines += 1;
    }

    return score - numberNines;
  }

  render() {

    if (this.state.loaded == false) {
      return (
        <View style={styles.container}>
          <Text>Loading...</Text>
        </View>
      );
    }

    else {

    const state = this.state;
    const element = (data, teeTimeId, playerId, holeIndex) => (
      <TouchableOpacity onPress={() => this.changeScore(playerId, holeIndex, teeTimeId)} style={{backgroundColor:data[1]}}>
        <View>
          <Text>{data[0]}</Text>
        </View>
      </TouchableOpacity>
    );


    var teeTime = this.props.teetime.id;
    var tableData = this.state.displayScores;
    tables = [];
    for (var playerId in tableData) {
      cells = []
      for (var index = 1; index < 14; index++) {
        if (index < 3 || index > 12) {
          cellData = tableData[playerId][index];
        }
        else if (this.props.editable == false) {
          cellData = tableData[playerId][index];
        }
        else {
          if (this.props.editable == false) {
            cellData = tableData[playerId][index];
          }
          else {
          cellData = [element(tableData[playerId][index], teeTime, playerId, index), tableData[playerId][index][1]];
          }
        }

        cells.push(<Cell key={'cell-' + playerId + '-' + index} data={cellData[0]} style={{'width':this.state.widthArr[index], backgroundColor:cellData[1]}} textStyle={{margin: 6}}/>);

      }
      tables.push(<TableWrapper key={'table-' + playerId + '-' + index} style={styles.row}>{cells}</TableWrapper>);
    }

    playerIds = []
    usableTableData = [];
    for (var i in this.state.displayPoints) {
      playerIds.push(i);
      usableTableData.push(this.state.displayPoints[i]);
    }

    teeTimeTable = <Table key={teeTime['id']} borderStyle={{borderColor: 'transparent'}}>
      <Row data={state.hcp} style={styles.head} widthArr={this.state.parWidth} textStyle={styles.text}/>
      <Row data={state.tableHead} style={styles.head} widthArr={this.state.widthArr} textStyle={styles.text}/>
      {tables}
      <Row data={state.par} style={styles.head} widthArr={this.state.parWidth} textStyle={styles.text}/>
      <Rows data={usableTableData} widthArr={this.state.pointsWidth} textStyle={styles.text} textStyle={{margin: 6}} />
    </Table>;


    if (this.props.players[this.state.currentCell[0]]) {
      currentPlayer = this.props.players[this.state.currentCell[0]]['full_name']
    }
    else {
      currentPlayer = 'None'
    }

    currentHole = this.state.currentCell[1] - 3;

    return (

      <View style={styles.container}>
        <ScrollView horizontal={true}>
          {teeTimeTable}
        </ScrollView>
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            alert('Modal has been closed.');
          }}>
          <View style={{marginTop: 22}}>
            <View>
            <InputGroup>
                <Item floatingLabel>
                <Label>Click To Enter Score for {currentPlayer} on Hole {currentHole}</Label>
                <Input placeholder="" onChangeText={(text) => this.handleChange('newScore',text)}/>
                </Item>
            </InputGroup>

            <Button onPress={() => this.saveScore(false)} full success>
              <Text>Save Score</Text>
            </Button>

            <Button onPress={() => this.saveScore(true)} full primary>
              <Text>Auto Points</Text>
            </Button>

            <Button onPress={this.hideModal} full danger>
              <Text>Nevermind</Text>
            </Button>

            </View>
          </View>
        </Modal>
      </View>
    )
  }
  }
}



const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff' },
  head: { height: 40, backgroundColor: '#f1f8ff' },
  text: { margin: 6 },
  row: { flexDirection: 'row', backgroundColor: '#FFF' },
  btn: { width: 58, height: 18, backgroundColor: '#78B7BB',  borderRadius: 2 },
  btnText: { textAlign: 'center', color: '#fff' }
});

export default Scorecard;
