import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Toast, Container, Header, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Text, Card, CheckBox, CardItem, List, ListItem, InputGroup, Input, Spinner } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import CMCard from '../library/card.js';

class LeagueCard extends React.Component {
  constructor(props) {
    super(props);
    this.chooseLeague = this.chooseLeague.bind(this);

  }

    chooseLeague() {
      //this.props.setGlobalState('league_id',this.props.id)
      //this.props.setGlobalState('page','league')
    }

    render() {
      if (this.props.owned == true) {
        inviteCode = <Text>Invite Code: {this.props.verification_code}</Text>
      }
      else {
        inviteCode = <View></View>;
      }

      var body= <View>
      {inviteCode}
      <Text>Next Tee Time: Sunday, July 23, 8am</Text>
      <View>
      <Button iconRight onPress={console.log("Hi")} >
        <Text>View</Text>
      </Button>
      </View>
      </View>;

      return (
        <CMCard title={this.props.name} body={body} />
        )
    }
}

export default LeagueCard;
