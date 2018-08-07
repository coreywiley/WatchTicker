import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Modal, TouchableHighlight } from 'react-native';
import { Table, TableWrapper, Row, Cell } from 'react-native-table-component';
import { Toast, Container, Header, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Text, Card, CheckBox, CardItem, List, ListItem, InputGroup, Input, Spinner, Item, Label } from 'native-base';
import ajaxWrapper from '../base/ajax.js';

class Game extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tableHead: ['Name', '1', '2', '3', 'Points'],
      teeTimes: {},
      scores: {},
      allPlayers: {'0':{'full_name':'None'}},
      currentCell: ['0',0, 0],
      modalVisible: false,
      newScore: 0,
    }

    this.hideModal = this.hideModal.bind(this);
    this.saveScore = this.saveScore.bind(this);
    this.changeScore = this.changeScore.bind(this);
    this.prepareScorecards = this.prepareScorecards.bind(this);
    this.saveScore = this.saveScore.bind(this);
  }

  componentDidMount() {
    ajaxWrapper('GET','/api/home/teetime/?game=32&related=players',{},this.prepareScorecards)

  }

  prepareScorecards(result) {
    allPlayers = {}
    teeTimes = {}
    scores = {}
    console.log("Result",result)
    for (var index in result) {
      teeTime = result[index]['teetime'];
      console.log("TeeTime",teeTime)
      playerIds = []
      for (var index2 in teeTime['players']) {
        player = teeTime['players'][index2]['user']
        playerIds.push(player.id)
        allPlayers[player.id] = player
        scores[player.id] = [[player.full_name,'#fff'],[0,'#fff'],[0,'#fff'],[0,'#fff'],[0,'#fff']]
      }
      teeTime['playerIds'] = playerIds
      teeTimes[teeTime.id] = teeTime
    }

    this.setState({allPlayers:allPlayers,teeTimes:teeTimes,scores:scores});
  }

  changeScore(playerId, holeIndex, teeTimeId) {
    this.setState({modalVisible:true, currentCell: [playerId.toString(), holeIndex, teeTimeId]})
  }

  hideModal() {
    this.setState({modalVisible:false})
  }

  saveScore() {
    scores = this.state.scores;
    score = this.state.scores[this.state.currentCell[0]]
    score[this.state.currentCell[1]] = this.state.newScore
    scores[this.state.currentCell[0]] = score

    teeTimePlayers = this.state.teeTimes[this.state.currentCell[2]]['playerIds']
    minScore = 10
    numMinScored = 0
    for (var index in teeTimePlayers) {
      playerId = teeTimePlayers[index]
      if (this.state.scores[playerId][this.state.currentCell[1]][0] < minScore) {
        minScore = this.state.scores[playerId][this.state.currentCell[1]][0]
        numMinScored = 1
      }
      else if (this.state.scores[playerId][this.state.currentCell[1]][0] == minScore) {
        numMinScored += 1
      }
    }

    if (minScore > 0) {
      for (var index in teeTimePlayers) {
        playerId = teeTimePlayers[index]
        if (this.state.scores[playerId][this.state.currentCell[1]][0] == minScore) {
            score = this.state.scores[playerId]
            score[this.state.currentCell[1]] = [score[this.state.currentCell[1]][0],'#5d9451']
            if (numMinScored == 1) {
              score[4] = [score[4][0] + 2,'#fff']
            } else {
              score[4] = [score[4][0] + 1,'#fff']
            }

            this.state.scores[playerId] = score;
        }
      }
    }

    this.setState({scores:scores, modalVisible:false})
  }

  handleChange(name,value) {
      var newState = {};
      newState[name] = value;
      var newCompleteState = this.state;
      newCompleteState[name] = value;
      this.setState(newState);
  }

  render() {
    const state = this.state;
    const element = (data, teeTimeId, playerId, holeIndex) => (
      <TouchableOpacity onPress={() => this.changeScore(playerId, holeIndex, teeTimeId)} style={{backgroundColor:data[1]}}>
        <View>
          <Text>{data[0]}</Text>
        </View>
      </TouchableOpacity>
    );


    teeTimes = []
    for (var id in this.state.teeTimes) {
      teeTime = this.state.teeTimes[id]
      tableData = []
      for (var i in teeTime['playerIds']) {
        tableData.push(this.state.scores[teeTime['playerIds'][i]])
      }
      console.log("Table Data",tableData)
      teeTimeTable = <Table key={teeTime['id']} borderStyle={{borderColor: 'transparent'}}>
        <Row data={state.tableHead} style={styles.head} textStyle={styles.text}/>
        {
          tableData.map((rowData, index) => (
            <TableWrapper key={index} style={styles.row}>
              {
                rowData.map((cellData, cellIndex) => (
                  <Cell key={cellIndex} data={cellIndex === 0 ? cellData[0] : element(cellData, id, teeTime['playerIds'][index], cellIndex)} textStyle={{margin: 6}}/>
                ))
              }
            </TableWrapper>
          ))
        }
      </Table>;

      teeTimes.push(teeTimeTable)
    }

    if (this.state.allPlayers[this.state.currentCell[0]]) {
      currentPlayer = this.state.allPlayers[this.state.currentCell[0]]['full_name']
    }
    else {
      currentPlayer = 'None'
    }

    currentHole = this.state.currentCell[1]

    return (
      <View style={styles.container}>
        {teeTimes}
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

            <Button onPress={this.saveScore} full success>
              <Text>Save Score</Text>
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



const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff' },
  head: { height: 40, backgroundColor: '#f1f8ff' },
  text: { margin: 6 },
  row: { flexDirection: 'row', backgroundColor: '#FFF' },
  btn: { width: 58, height: 18, backgroundColor: '#78B7BB',  borderRadius: 2 },
  btnText: { textAlign: 'center', color: '#fff' }
});

export default Game;
