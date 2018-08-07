import React from 'react';
import { StyleSheet, View } from 'react-native';
import ajaxWrapper from '../base/ajax.js';
import { Toast, Container, Header, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Text, Card, CheckBox, CardItem, List, ListItem, InputGroup, Input, Spinner } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import LeagueCard from '../localLibrary/leagueCard.js';
import CMCard from '../library/card.js';

class Leagues extends React.Component {
  constructor(props) {
        super(props);
        this.state = {
          ownedLeagues: [],
          playLeagues: [],
          loaded:false,
        };

        this.ownedLeagues = this.ownedLeagues.bind(this);
        this.chooseLeague = this.chooseLeague.bind(this);

      }

    componentDidMount() {
      console.log("Running Ajax")
      this.props.setGlobalState('league':undefined);
      ajaxWrapper('GET','/api/home/leagueplayers/?related=league&user=' + this.props.userId, {}, this.ownedLeagues)
    }

    ownedLeagues(result) {
      ownedLeagues = this.state.ownedLeagues;
      playLeagues = this.state.playLeagues;
      console.log("Result");
      for (var index in result) {
        if (result[index]['leagueplayers']['owner'] == true) {
          league = result[index]['leagueplayers']['league']
          league['owner'] = true;
          ownedLeagues.push(league)
        }
        else {
          league = result[index]['leagueplayers']['league']
          league['owner'] = false;
          playLeagues.push(result[index]['leagueplayers']['league'])
        }
      }
      this.setState({ownedLeagues:ownedLeagues, playLeagues: playLeagues, loaded:true})
    }

    chooseLeague(league) {
      this.props.setGlobalState('league',league);
      this.props.setGlobalState('page','league');
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
      console.log("Leagues",this.state.ownedLeagues);
      ///
      leagueCards = [];


      for (var index in this.state.ownedLeagues) {
        var league = this.state.ownedLeagues[index]
        var body= <View>
        <Text>Invite Code: {league.verification_code}</Text>
        <View>
        <Button key={'owned-' + index} iconRight onPress={this.chooseLeague.bind(this,league)} >
          <Text>View</Text>
        </Button>
        </View>
        </View>;

        leagueCards.push(<CMCard key={league.id} title={league.name} body={body} />)

      }

      for (var index in this.state.playLeagues) {
        var league = this.state.playLeagues[index]
        var body= <View>
        <View>
        <Button key={'play-' + index} iconRight onPress={this.chooseLeague.bind(this,league)} >
          <Text>View</Text>
        </Button>
        </View>
        </View>;

        leagueCards.push(<CMCard key={league.id} title={league.name} body={body} />)

      }



      return (
        <Content>
        {leagueCards}

        <Button onPress={() => this.props.setGlobalState('page','addLeague')} full success>
          <Text>Add New League</Text>
        </Button>
        </Content>
        )
    }
  }
}

export default Leagues;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
