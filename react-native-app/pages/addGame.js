import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import ajaxWrapper from '../base/ajax.js';
import { H2, Container, Header, Title, Content, Button, Left, Right, Body, Text, Card, CheckBox,ItemPicker, Picker, List, ListItem, InputGroup, Input, Spinner, Item, Label } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import CMCard from '../library/card.js';
import DateTimePicker from 'react-native-modal-datetime-picker';

class AddGame extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      isDatePickerVisible: false,
      isTimePickerVisible: false,
      users:{},
      players: [],
      date:'',
      teeTimes:[],
      existingTeeTimes:[],
      holes: '',
      loaded:false,
    };

    this.assemblePlayers = this.assemblePlayers.bind(this);
    this.formSubmit = this.formSubmit.bind(this);
    this.gameCreated = this.gameCreated.bind(this);
    this.addTeeTimes = this.addTeeTimes.bind(this);
    this.getGameCallback = this.getGameCallback.bind(this);
  }



  _showDatePicker = () => this.setState({ isDatePickerVisible: true });

  _hideDatePicker = () => this.setState({ isDatePickerVisible: false });

  _handleDatePicked = (date) => {
    if (date.getMonth() < 10) {
      month = '0' + date.getMonth();
    }
    else {
      month = date.getMonth() + 1;
    }
    if (date.getDate() < 10) {
      day = '0' + date.getDate();
    }
    else {
      day = date.getDate();
    }
    var dateString = date.getFullYear() + '-' + month + '-' + day;
    this.setState({ isDatePickerVisible: false,date:dateString });
  };

  _showTimePicker = () => this.setState({ isTimePickerVisible: true });

  _hideTimePicker = () => this.setState({ isTimePickerVisible: false });

  _handleTimePicked = (date) => {

    var teeTimes = this.state.teeTimes;
    if (date.getMinutes() < 10) {
      var timeString = date.getHours() + ':0' + date.getMinutes();
    }
    else {
      var timeString = date.getHours() + ':' + date.getMinutes();
    }
    teeTimes.push(timeString);
    this.setState({ isTimePickerVisible: false, teeTimes:teeTimes })
  };

  removeTeeTime(teeTime) {
      teeTimes = this.state.teeTimes;
      index = teeTimes.indexOf(teeTime);
      teeTimes.splice(index,1);
      this.setState({teeTimes:teeTimes})
  }

  componentDidMount() {
    ajaxWrapper('GET','/api/home/leagueplayers/?league=' + this.props.league.id + '&related=user',{}, this.assemblePlayers)
  }

  assemblePlayers(result) {

    users = {};
    players = []

    for (var index in result) {
      user = result[index]['leagueplayers']['user']
      userId = user['id']
      users[userId] = user;
      players.push(userId)
    }

    if (this.props.game) {
      this.setState({users:users, players:players}, () => ajaxWrapper('GET','/api/home/game/' + this.props.game.id + '/?related=teetime,users', {}, this.getGameCallback))
    }
    else {
      this.setState({users:users, players:players})
    }

  }

  getGameCallback(value) {
    var game = value[0]['game']
    var date = game['date']
    teeTimes = [];
    players = [];
    existingTeeTimes = [];
    for (var index in game['teetime']) {
      tempTeeTime = game['teetime'][index]['teetime']
      existingTeeTimes.push(tempTeeTime);
      timeString = tempTeeTime['date'].substring(11,16);
      teeTimes.push(timeString);
    }

    for (var index in game['users']) {
      user = game['users'][index]['user'];
      players.push(user['id']);
    }

    this.setState({date:date, teeTimes:teeTimes, existingTeeTimes:teeTimes, players:players, holes: game['holes'], loaded: true});

  }

  togglePlayer(id) {
    players = this.state.players;
    index = players.indexOf(id);
    if (index == -1) {
      players.push(id);
    } else {
      players.splice(index,1);
    }
    this.setState({players:players})

  }

  formSubmit() {
    //create game
    data = {date:this.state.date, league:this.props.league.id, holes: this.state.holes}
    console.log("Create Game",data)
    if (this.props.game) {
      ajaxWrapper('POST','/api/home/game/' + this.props.game.id + '/',data,this.gameCreated)
    } else {
      ajaxWrapper('POST','/api/home/game/',data,this.gameCreated)
    }

  }

  gameCreated(result) {
    console.log("Game Created Result",result);
    var game = result[0]['game'];
    data = {'users[]':this.state.players, 'users__clear':''}
    console.log("Player Data", data);
    ajaxWrapper('POST','/api/home/game/' + game.id + '/',data,this.addTeeTimes)

  }

  addTeeTimes(result) {
    game = result[0]['game']
    console.log("Add Tee Time Result", result)
    existingTeeTimes = this.state.existingTeeTimes;

    for (var index in this.state.teeTimes) {
      if (existingTeeTimes.indexOf(this.state.teeTimes[index]) == -1) {
        var data = {'game':game.id,'date':this.state.date + ' ' + this.state.teeTimes[index]}
        console.log("Tee Time Data", data)
        ajaxWrapper('POST','/api/home/teetime/',data,console.log)
      }
    }

    this.props.setGlobalState('game',game);
    this.props.setGlobalState('page','manageGroups');

  }

  onValueChangeHoles(value: string) {
    this.setState({
      holes: value
    });
  }


  render () {
    if (this.state.loaded == false) {
      return (
        <View style={styles.container}>
          <Text>Loading...</Text>
        </View>
      );
    }
    else {
    users = [];

    for (var index in this.state.users) {
        var playing = false;
        userId = this.state.users[index].id
        if (this.state.players.indexOf(userId) > -1) {
          playing = true;
        }
        tempPlayer = <ListItem key={index}>
          <CheckBox checked={playing} onPress={this.togglePlayer.bind(this,userId)} />
          <Body>
            <Text>{this.state.users[index].full_name}</Text>
          </Body>
        </ListItem>;
        users.push(tempPlayer);
    }

    teeTimes = []
    for (var index in this.state.teeTimes) {
            tempTime = <ListItem>
            <Left>
            <Text>{this.state.teeTimes[index]}</Text>
            </Left>
            <Right>
            <Button onPress={this.removeTeeTime.bind(this,this.state.teeTimes[index])} transparent>
                <Icon name='times' style={{'color':'red'}} />
              </Button>
              </Right>
              </ListItem>
            teeTimes.push(tempTime);
    }

    return (
      <ScrollView style={{ flex: 1 }}>
        <Button onPress={this._showDatePicker} full info>
          <Text>{this.state.date}</Text>
          <Text>Choose The Next Game Day</Text>
        </Button>
        <Text>{"\n"}</Text>
        <List>
          {teeTimes}
        </List>

        <Button onPress={this._showTimePicker} full info>
          <Text>Add A Tee Time</Text>
        </Button>
        <H2>Who is playing?</H2>
        <List>
          {users}
        </List>

        <Item picker>
          <Picker
            mode="dropdown"
            iosIcon={<Icon name="arrow-down" />}
            style={{ width: undefined }}
            placeholder="Front or Back 9"
            placeholderStyle={{ color: "#bfc6ea" }}
            placeholderIconColor="#007aff"
            selectedValue={this.state.holes}
            onValueChange={this.onValueChangeHoles.bind(this)}
          >
            <Picker.Item label="Front 9" value="Front 9" />
            <Picker.Item label="Back 9" value="Back 9" />
          </Picker>
        </Item>

        <Button onPress={this.formSubmit} full>
          <Text>Set Up Groups</Text>
        </Button>

        <DateTimePicker
          mode={'date'}
          isVisible={this.state.isDatePickerVisible}
          onConfirm={this._handleDatePicked}
          onCancel={this._hideDatePicker}
        />
        <DateTimePicker
          mode={'time'}
          isVisible={this.state.isTimePickerVisible}
          onConfirm={this._handleTimePicked}
          onCancel={this._hideTimePicker}
        />
      </ScrollView>
    );
  }
}
}

export default AddGame;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
