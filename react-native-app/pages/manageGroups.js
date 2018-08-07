import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView } from 'react-native';
import { Table, Row, Rows } from 'react-native-table-component';
import { H2, Container, Header, Title, Content, Button, Left, Right, Body, Text, Card, CheckBox,ItemPicker, Picker, List, ListItem, InputGroup, Input, Spinner, Item, Label } from 'native-base';
import ajaxWrapper from '../base/ajax.js';

class ManageGroups extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allPlayers: {},
      unAssignedPlayers: [],
      teeTimes: [],
      tableHead: ['Name', 'Flight', 'Handicap', 'Team'],
      leaguePlayers: [],
      selectedPlayer: ['None',0],
      error: '',
      loaded: false,
    }
    this.getTeeTimes = this.getTeeTimes.bind(this);
    this.createTeeTimes = this.createTeeTimes.bind(this);
    this.selectPlayer = this.selectPlayer.bind(this);
    this.selectTeeTime = this.selectTeeTime.bind(this);
    this.saveGroups = this.saveGroups.bind(this);
    this.render = this.render.bind(this);
    this.randomAssign = this.randomAssign.bind(this);
  }

  componentDidMount() {
    console.log("Game Id",this.props.gameId)
    ajaxWrapper('GET','/api/home/leaguePlayers/?related=user&league=' + this.props.league.id, {}, this.getTeeTimes )
  }

  componentDidUpdate(oldState, oldProps) {
    if (this.state.leaguePlayers && this.state.teeTimes.length == 0) {
      ajaxWrapper('GET','/api/home/teetime/?related=teetimePlayers&game=' + this.props.gameId, {}, this.createTeeTimes)
    }
  }

  shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }

  randomAssign() {
    console.log("Here");
    // get flights Together
    flights = {}
    for (var player in allPlayers) {
      console.log("allPlayers")
      flight = allPlayers[player].flight;
      if (flights[flight]) {
        console.log("Flight exists");
        flights[flight].push(allPlayers[player])
      } else {
        flights[flight] = []
        flights[flight].push(allPlayers[player])
      }
    }

    teams = [];

    for (var flight in flights) {
        flights[flight] = this.shuffle(flights[flight])
    }

    console.log("Length", flights[flight].length, flights)
    for (var i = 0; i < flights[flight].length; i++) {
      team = []
      for (var flight in flights) {
        team.push(flights[flight][i])
      }
      teams.push(team);
    }

    teeTimes = this.state.teeTimes;
    console.log("Teams",teams)
    for (var index in teeTimes) {
      addTeeTime = teeTimes[index]
      playerIds = [];
      console.log("Tests", index*2, index*2 +1, teams.length)
      if (index*2 < teams.length) {
      for (var playerIndex in teams[index*2]) {
        console.log("Player Id", teams[index*2][playerIndex]['user']['id'])
        playerIds.push(teams[index*2][playerIndex]['user']['id'])
      }
    }
    if (teams.length > index*2 + 1) {
      for (var playerIndex in teams[index*2+1]) {
        playerIds.push(teams[index*2+1][playerIndex]['user']['id'])
      }
    }
    console.log(playerIds);
    addTeeTime['playerIds'] = playerIds;
    teeTimes[index] = addTeeTime;
    }

    this.setState({teeTimes:teeTimes})


  }

  getTeeTimes(result) {
    console.log("Result",result)
    this.setState({leaguePlayers:result})
  }

  createTeeTimes(result) {
    console.log("Result", result)
    console.log("League Players", this.state.leaguePlayers)
    allPlayers = {}
    for (var index in this.state.leaguePlayers) {
      player = this.state.leaguePlayers[index]['leaguePlayers'];
      allPlayers[player.user.id] = player;
    }

    teeTimes = []
    assignedPlayers = []
    console.log("Tee Time Result", result)
    for (var index in result) {
      var teeTime = result[index]['teetime'];
      console.log('TeeTime', teeTime)
      tempPlayers = []
      for (var index2 in teeTime['teetimePlayers']) {
        playerId = teeTime['teetimePlayers'][index2]['teetimeplayer']['user_id'];
        allPlayers[playerId]['teetimeplayer'] = teeTime['teetimePlayers'][index2]['teetimeplayer']['id']
        allPlayers[playerId]['team'] = teeTime['teetimePlayers'][index2]['teetimeplayer']['team']
        tempPlayers.push(playerId)
        assignedPlayers.push(playerId)
      }
      teeTime['playerIds'] = tempPlayers;
      teeTimes.push(teeTime);
    }

    unAssignedPlayers = [];
    for (var index in allPlayers) {
      console.log("Index",index);
      console.log("Assigned Players", assignedPlayers)
      if (assignedPlayers.indexOf(parseInt(index)) == -1) {
        unAssignedPlayers.push(index)
      }
    }

    console.log("UnAssignPlayers", unAssignedPlayers)
    this.setState({teeTimes:teeTimes, allPlayers:allPlayers, unAssignedPlayers:unAssignedPlayers, loaded:true})
  }

  selectPlayer = (groupIndex, index) => {
    if (this.state.selectedPlayer[0] == groupIndex && this.state.selectedPlayer[1] == index) {
      this.setState({selectedPlayer: ['None',0]})
    } else {
      this.setState({selectedPlayer: [groupIndex,index]})
    }
  }

  selectTeeTime(index) {
    if (this.state.selectedPlayer[0] != 'None') {
      teeTimes = this.state.teeTimes;
      addTeeTime = teeTimes[index];
      if (this.state.selectedPlayer[0] == 'unAssigned') {
        unAssignedPlayers = this.state.unAssignedPlayers
        playerId = unAssignedPlayers[this.state.selectedPlayer[1]];
        unAssignedPlayers.splice(this.state.selectedPlayer[1],1);
      }
      else {
        teeTime = teeTimes[this.state.selectedPlayer[0]]
        playerIds = teeTime['playerIds']
        playerId = playerIds[this.state.selectedPlayer[1]]
        playerIds.splice(this.state.selectedPlayer[1],1)
        teeTime['playerIds'] = playerIds
        teeTimes[this.state.selectedPlayer[0]] = teeTime
      }

      addTeeTime['playerIds'].push(playerId)
      flights = {}
      for (var p in addTeeTime['playerIds']) {
        tempPlayer = allPlayers[addTeeTime['playerIds'][p]]
        if (!flights[tempPlayer.flight]) {
          flights[tempPlayer.flight] = []
        }
        flights[tempPlayer.flight].push(tempPlayer);
        allPlayers[addTeeTime['playerIds'][p]]['team'] = flights[tempPlayer.flight].length;
      }

      teeTimes[index] = addTeeTime;

      if (this.state.selectedPlayer[0] == 'unAssigned') {
        this.setState({unAssignedPlayers:unAssignedPlayers, teeTimes:teeTimes, selectedPlayer:['None',0], error:''})
      }
      else {
        this.setState({teeTimes:teeTimes, selectedPlayer:['None',0], allPlayers:allPlayers})
    }
  }
  }

  saveGroups() {
    if (this.state.unAssignedPlayers.length > 0) {
      this.setState({error: 'Please Assign All Players First'})
    } else {
      for (var index in this.state.teeTimes) {
        teeTime = this.state.teeTimes[index]
        for (var p in teeTime['playerIds']) {
          player = allPlayers[teeTime['playerIds'][p]];
          console.log("Player",player)
          data = {teetime:teeTime['id'],handicap: player['handicap'], flight: player['flight'], team: player['team'], user: player.user.id}
          if (player.teetimeplayer) {
            ajaxWrapper('POST','/api/home/teetimeplayer/' + player.teetimeplayer + '/', data, console.log)
          }
          else {
            ajaxWrapper('POST','/api/home/teetimeplayer/', data, console.log)
          }
        }
      }
      this.props.setGlobalState('page','league')
    }
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
    component = this;
    rows = []
    for (var index in this.state.unAssignedPlayers) {
      player = this.state.allPlayers[unAssignedPlayers[index]];
      if (this.state.selectedPlayer[0] == 'unAssigned' && this.state.selectedPlayer[1] == index) {
        rows.push(<TouchableOpacity onPress={this.selectPlayer.bind(this,'unAssigned',index)}><Row data={[player.user.full_name,player.flight,player.handicap, 0]} style={{backgroundColor: '#5d9451'}} textStyle={styles.text} /></TouchableOpacity>)
      } else{
        rows.push(<TouchableOpacity onPress={this.selectPlayer.bind(this,'unAssigned',index)}><Row data={[player.user.full_name,player.flight,player.handicap, 0]} textStyle={styles.text} /></TouchableOpacity>)
      }

    }

    unAssignedTable = <View></View>;

    if (rows.length > 0) {
      unAssignedTable = <View><Text>Un-Assigned Players</Text>
      <Table borderStyle={{borderWidth: 2, borderColor: '#c8e1ff'}}>
        <Row data={this.state.tableHead} style={styles.head} textStyle={styles.text} />
        {rows}
      </Table>
      </View>;
    }

    groups = []
    for (var index in this.state.teeTimes) {
      teeTime = this.state.teeTimes[index]
      rows = []
      for (var index2 in teeTime['playerIds']) {
        console.log(teeTime['playerIds'][index2], this.state.allPlayers)
        player = this.state.allPlayers[teeTime['playerIds'][index2]]
        if (this.state.selectedPlayer[0] == index && this.state.selectedPlayer[1] == index2) {
          rows.push(<TouchableOpacity onPress={this.selectPlayer.bind(this,index,index2)}><Row data={[player.user.full_name,player.flight,player.handicap, player.team]} style={{backgroundColor: '#5d9451'}} textStyle={styles.text} /></TouchableOpacity>)
        } else {
          rows.push(<TouchableOpacity onPress={this.selectPlayer.bind(this,index,index2)}><Row data={[player.user.full_name,player.flight,player.handicap, player.team]} textStyle={styles.text} /></TouchableOpacity>)
        }
      }

      group = <View key={teeTime['id']}>
      <Text>Tee Time: {teeTime.date}</Text>
      <Table borderStyle={{borderWidth: 2, borderColor: '#c8e1ff'}}>
        <TouchableOpacity onPress={this.selectTeeTime.bind(this,index)}><Row data={this.state.tableHead} style={styles.head} textStyle={styles.text} /></TouchableOpacity>
        {rows}
      </Table></View>;
      groups.push(group);
    }

    return (
      <ScrollView style={styles.container}>
        <Text>Click A Player And then a teetime to add them to a group.</Text>

        {unAssignedTable}
        <Button onPress={this.randomAssign} full>
          <Text>Random Assign</Text>
        </Button>
        {groups}

        <Button onPress={this.saveGroups} full>
          <Text>Save Groups</Text>
        </Button>
        <Text>{this.state.error}</Text>
      </ScrollView>
    )
  }
}
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff' },
  head: { height: 40, backgroundColor: '#f1f8ff' },
  text: { margin: 6 }
});

export default ManageGroups
