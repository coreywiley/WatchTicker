import React from 'react';
import { StyleSheet, View, Modal } from 'react-native';
import ajaxWrapper from '../base/ajax.js';
import { Toast, Container, Header, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Text, Card, CheckBox, CardItem, List, ListItem, InputGroup, Input, Spinner, Item, Label } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import LeagueCard from '../localLibrary/leagueCard.js';
import CMCard from '../library/card.js';

class ManagePlayers extends React.Component {
  constructor(props) {
        super(props);
        this.state = {
          userInfo: {},
          users: [],
          currentUser: undefined,
          modalVisible: false,
          flight:'',
          handicap:0
        };

        this.getUsers = this.getUsers.bind(this);
        this.getUsersCallback = this.getUsersCallback.bind(this);
        this.removeUser = this.removeUser.bind(this);
        this.savePlayer = this.savePlayer.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.hideModal = this.hideModal.bind(this);
      }

    componentDidMount() {
      this.getUsers('');
    }

    getUsers(value) {
      ajaxWrapper('GET','/api/home/leagueplayers/?league=' + this.props.league.id + '&related=user&order_by=id', {}, this.getUsersCallback)
    }

    getUsersCallback(result) {
      console.log("Result",result)
      users = []
      userInfo = {}
      for (var index in result) {
        users.push(result[index]['leagueplayers'])
        userInfo[result[index]['leagueplayers']['id']] = result[index]['leagueplayers']
      }
      console.log("Users",users);
      this.setState({users:users, userInfo:userInfo, modalVisible: false})
    }

    removeUser(id) {
      ajaxWrapper('POST','/api/home/leagueplayers/' + id + '/delete/', {}, console.log)
    }

    editUser(id) {
        user = userInfo[id];
        this.setState({modalVisible:true,currentUser:id, flight:user['flight'], handicap:user['handicap'].toString()})
    }

    handleChange(name,value) {
        var newState = {};
        newState[name] = value;
        var newCompleteState = this.state;
        newCompleteState[name] = value;
        this.setState(newState);
    }

    hideModal() {
      this.setState({modalVisible:false})
    }

    savePlayer() {
      data = {flight:this.state.flight, handicap: this.state.handicap}
      ajaxWrapper('POST','/api/home/leagueplayers/' + this.state.currentUser + '/', data, this.getUsers)
    }

    render() {

      userCards = [];


      for (var index in this.state.users) {
        var user = this.state.users[index]
        console.log("User",user)
        var body= <View>
        <Text>Flight: {user['flight']}</Text>
        <Text>Handicap: {user['handicap']}</Text>
        <Button key={'edit-' + index} iconRight onPress={this.editUser.bind(this,user['id'])} success>
          <Text>Edit User</Text>
        </Button>
        <Button key={'remove-' + index} iconRight onPress={this.removeUser.bind(this,user['id'])} danger>
          <Text>Remove User</Text>
        </Button>
        </View>;

        userCards.push(<CMCard key={user['id']} title={user['user']['full_name']} body={body} />)

      }

      userName = '';
      if (this.state.currentUser) {
        userName = this.state.userInfo[this.state.currentUser]['user']['full_name']
      }

      console.log("Flight",this.state.flight)
      console.log("Handicap",this.state.handicap)

      return (
        <Content>
        {userCards}

        <Button onPress={() => this.props.setGlobalState('page','league')} full success>
          <Text>Back To League</Text>
        </Button>
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            alert('Modal has been closed.');
          }}>
          <View style={{marginTop: 22}}>
            <View>
            <Text>{userName}</Text>
            <InputGroup>
                <Item floatingLabel>
                <Label>Flight</Label>
                <Input placeholder="" onChangeText={(text) => this.handleChange('flight',text)} value={this.state.flight}/>
                </Item>
            </InputGroup>
            <InputGroup>
                <Item floatingLabel>
                <Label>Handicap</Label>
                <Input placeholder="" onChangeText={(text) => this.handleChange('handicap',text)} value={this.state.handicap}/>
                </Item>
            </InputGroup>

            <Button onPress={this.savePlayer} full success>
              <Text>Save Player</Text>
            </Button>

            <Button onPress={this.hideModal} full danger>
              <Text>Nevermind</Text>
            </Button>

            </View>
          </View>
        </Modal>
        </Content>
        )
    }
}

export default ManagePlayers;
