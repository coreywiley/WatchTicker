import React from 'react';
import { StyleSheet, View } from 'react-native';
import ajaxWrapper from '../base/ajax.js';
import { Toast, Container, Header, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Text, Card, CheckBox, CardItem, List, ListItem, InputGroup, Input, Spinner } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import CMCard from '../library/card.js';

class JoinLeague extends React.Component {
    constructor(props){
      super(props)

      this.state = {
        inputCode: '',
        error:'',
      }

      this.formSubmit = this.formSubmit.bind(this);
      this.formSubmitCallback = this.formSubmitCallback.bind(this);
      this.success = this.success.bind(this);
    }

      handleChange(name,value) {
          var newState = {};
          newState[name] = value;
          var newCompleteState = this.state;
          newCompleteState[name] = value;
          newState['error'] = '';
          this.setState(newState);
      }

    formSubmit() {
      console.log("HERE")
      ajaxWrapper('GET','/api/home/league/?verification_code=' + this.state.inputCode,{}, this.formSubmitCallback)
    }

    formSubmitCallback(value) {
      if (value.length > 0) {
        console.log("Value",value);
        var league = value[0]['league']
        ajaxWrapper('POST','/api/home/league/' + league.id + '/',{'users[]':[this.props.userId]}, this.success)
      }
      else {
        this.setState({error:'No League Matched. Try Another Code.'})
      }
    }

    success(value) {
      console.log("Success",value);
      this.props.setGlobalState('page','myLeagues')
    }

    render() {

      return (
        <Content>
          <InputGroup>
              <Input placeholder="Invite Code" onChangeText={(text) => this.handleChange('inputCode',text)}/>
          </InputGroup>
          <Button full onPress={this.formSubmit}>
              <Text>Join A League</Text>
            </Button>
            <Text>{this.state.error}</Text>
          </Content>
        )
    }
}

export default JoinLeague;
