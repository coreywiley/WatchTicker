import React from 'react';
import { StyleSheet, View } from 'react-native';
import ajaxWrapper from '../base/ajax.js';
import { Container, Header, Title, Content, Button, Left, Right, Body, Text, Card, CheckBox,ItemPicker, Picker, List, ListItem, InputGroup, Input, Spinner, Item, Label } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import CMCard from '../library/card.js';

class AddLeague extends React.Component {
    constructor(props){
      super(props)
      console.log("League Props", this.props.league)
      if (this.props.league) {
        this.state = this.props.league
      } else {
        this.state = {
          singles:'',
          scoring_style:'',
          shared_skins:'',
          name:'',
          num_players:1,
          num_flights:1,
          handicap_pct:0,
          owner: this.props.userId,
          newLeague:true,
        }
      }

      this.formSubmitCallback = this.formSubmitCallback.bind(this);
      this.addLeagueOwner = this.addLeagueOwner.bind(this);
    }

      handleChange(name,value) {
          var newState = {};
          newState[name] = value;
          var newCompleteState = this.state;
          newCompleteState[name] = value;
          this.setState(newState);
      }

    formSubmit() {
      var data = this.state;
      if (this.props.league) {
        ajaxWrapper('POST','/api/home/league/' + this.props.league.id + '/',data, this.formSubmitCallback)
      }
      else {
        ajaxWrapper('POST','/api/home/league/',data, this.addLeagueOwner)
      }

    }

    addLeagueOwner(value) {
      console.log("Owner Value",value)
      data = {'league':value[0]['league']['id'], 'user':this.props.userId, 'owner':true}
      ajaxWrapper('POST','/api/home/leagueplayers/',data, this.formSubmitCallback)

    }

    formSubmitCallback(value) {
      this.props.setGlobalState('page','myLeagues')
    }

    onValueChangeSingles(value: string) {
      this.setState({
        singles: value
      });
    }

    onValueChangeScoringStyle(value: string) {
      this.setState({
        scoring_style: value
      });
    }

    onValueChangeSharedSkins(value: string) {
      this.setState({
        shared_skins: value
      });
    }

    render() {
      console.log("User Id Prop",this.props.userId)
      console.log("State",this.state)

      leagueSubmit = <Button onPress={() => this.formSubmit()} full>
        <Text>Create New League</Text>
      </Button>
      if (this.props.league) {
        leagueSubmit = <Button onPress={() => this.formSubmit()} full>
          <Text>Save League</Text>
        </Button>
      }

      useless = <InputGroup>
            <Item floatingLabel>
            <Label>Number Of Total Players</Label>
            <Input placeholder="" onChangeText={(text) => this.handleChange('num_players',text)} value={this.state.num_players.toString()}/>
            </Item>
        </InputGroup>

      return (
        <Content>

                    <InputGroup>
                        <Item floatingLabel>
                        <Label>League Name</Label>
                        <Input placeholder="" onChangeText={(text) => this.handleChange('name',text)} value={this.state.name}/>
                        </Item>
                    </InputGroup>


                  <Item picker>
                    <Picker
                      mode="dropdown"
                      iosIcon={<Icon name="arrow-down" />}
                      style={{ width: undefined }}
                      placeholder="Singles or Teams"
                      placeholderStyle={{ color: "#bfc6ea" }}
                      placeholderIconColor="#007aff"
                      selectedValue={this.state.singles}
                      onValueChange={this.onValueChangeSingles.bind(this)}
                    >
                      <Picker.Item label="Singles or Teams" value="" />
                      <Picker.Item label="Singles" value="Singles" />
                      <Picker.Item label="Teams" value="Teams" />
                    </Picker>
                  </Item>

                  <Item picker>
                    <Picker
                      mode="dropdown"
                      iosIcon={<Icon name="arrow-down" />}
                      style={{ width: undefined }}
                      placeholder="Scoring Style"
                      placeholderStyle={{ color: "#bfc6ea" }}
                      placeholderIconColor="#007aff"
                      selectedValue={this.state.scoring_style}
                      onValueChange={this.onValueChangeScoringStyle.bind(this)}
                    >
                      <Picker.Item label="Scoring Style" value="" />
                      <Picker.Item label="Points Per Hole" value="Points Per Hole" />
                      <Picker.Item label="Split Points" value="Split Points" />
                      <Picker.Item label="Overall Points" value="Overall Points" />
                    </Picker>
                  </Item>

                  <Item picker>
                    <Picker
                      mode="dropdown"
                      iosIcon={<Icon name="arrow-down" />}
                      style={{ width: undefined }}
                      placeholder="Skins Together/Seperate Between Flights"
                      placeholderStyle={{ color: "#bfc6ea" }}
                      placeholderIconColor="#007aff"
                      selectedValue={this.state.shared_skins}
                      onValueChange={this.onValueChangeSharedSkins.bind(this)}
                    >
                      <Picker.Item label="Skins Together/Seperate Between Flights" value="" />
                      <Picker.Item label="Together" value="Together" />
                      <Picker.Item label="Seperate" value="Seperate" />
                    </Picker>
                  </Item>



                    <InputGroup>
                        <Item floatingLabel>
                        <Label>% Of Handicap To Use</Label>
                        <Input placeholder="" onChangeText={(text) => this.handleChange('handicap_pct',text)} value={this.state.handicap_pct.toString()}/>
                        </Item>
                    </InputGroup>

                  {leagueSubmit}


          </Content>
        )
    }
}

export default AddLeague;
