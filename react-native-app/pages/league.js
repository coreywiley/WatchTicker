import React from 'react';
import { StyleSheet, View } from 'react-native';
import ajaxWrapper from '../base/ajax.js';
import { Toast, Container, Header, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Text, Card, CheckBox, CardItem, List, ListItem, InputGroup, Input, Spinner } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import CMCard from '../library/card.js';

class Leagues extends React.Component {
  constructor(props) {
    		super(props);
    		this.state = {
          game: undefined,
          inGame: false,
          loaded: false,
    		};

        this.getNextGameCallback = this.getNextGameCallback.bind(this);
    	}

      componentDidMount() {
        var todaysDate = new Date();
        var dateString = todaysDate.getFullYear() + "-" + (todaysDate.getMonth() + 1) + "-" + todaysDate.getDate();
        ajaxWrapper('GET','/api/home/game/?related=teetime,course,teetime__teetimePlayers,teetime__teetimePlayers__user&league=' + this.props.league.id + '&date__gte=' + dateString, {}, this.getNextGameCallback)
      }



      getNextGameCallback(value) {
        console.log("Value",value);
        if (value.length > 0) {
          found = false
          game = value[0]['game']
          nextTeeTime = ''
          group = []
          for (var index in game['teetime']) {
            var teetime = game['teetime'][index]['teetime']
            for (var index2 in teetime['teetimePlayers']) {
              if (found == false) {
              user = teetime['teetimePlayers'][index2]['teetimeplayer']['user']
              if (user.id = this.props.userId) {
                found = true;
                nextTeeTime = teetime['date'];
                for (var index3 in teetime['teetimePlayers']) {
                  user = teetime['teetimePlayers'][index3]['teetimeplayer']
                  group.push(user.user.full_name + ': ' + user.team + user.flight);
                }
              }
            }
          }
          }
          this.setState({game: game, loaded:true, group: group, nextTeeTime:nextTeeTime}, this.props.setGlobalState('game',game))
        }
        else {
          this.setState({loaded:true})
        }
      }

      attending() {
        data = {}
        if (this.state.inGame == true) {
            data = {'users[]__remove':[this.props.userId]}
        }
        else {
          data = {'users[]':[this.props.userId]}
        }

        ajaxWrapper('POST','/api/home/game/' + this.state.game.id + '/',data, this.attendingCallback)
      }

      attendingCallback(result) {
        this.setState({inGame: !this.state.inGame})
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
      sections = [];

      if (this.state.game) {
        var play = <Button onPress={() => this.props.setGlobalState('page','game')} success full>
          <Text>Play Game</Text>
        </Button>;
        sections.push(play);
      }
      console.log("Compare",this.props.userId,this.props.league.owner_id, this.props.league)
      if (parseInt(this.props.userId) == parseInt(this.props.league.owner_id)) {
          gameButton = <Button key={'button-2'} iconLeft onPress={() => this.props.setGlobalState('page','addGame')}>
            <Text>Add A Game</Text>
          </Button>
          if (this.state.game) {
            gameButton = <Button key={'button-2'} iconLeft onPress={() => this.props.setGlobalState('page','addGame')}>
              <Text>Edit Upcoming Game</Text>
            </Button>
          }

          leader = <View>{gameButton}
      <Button key={'button-0'} iconLeft onPress={() => this.props.setGlobalState('page','createLeague')}>
        <Text>Edit League</Text>
      </Button>
      <Button key={'button-1'} iconRight onPress={() => this.props.setGlobalState('page','managePlayers')}>
        <Text>Manage Players</Text>
      </Button>
      </View>
      sections.push(<CMCard key={0} title={'Edit League'} body={leader} />)
    }


      nextTeeTime = <View><Text>Next Game Not Scheduled Yet</Text></View>
      if (this.state.game) {
          nextTeeTime = <View><Text>{this.state.nextTeeTime}</Text></View>
      }
      sections.push(<CMCard key={1} title={'Next Tee Time'} body={nextTeeTime} />);

      if (this.state.game) {
        groupMembers = []
        for (var index in this.state.group) {
          groupMembers.push(<Text key={'members-' + index}>{this.state.group[index]}</Text>)
        }

        group = <View>
        {groupMembers}
        </View>

        sections.push(<CMCard key={2} title={'Group'} body={group} />);
      }

      average = <View>
      <Button onPress={() => this.props.setGlobalState('page','stats')} full>
        <Text>See League Stats</Text>
      </Button>
      </View>
      sections.push(average);




      return (
        <Content>
        {sections}
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
