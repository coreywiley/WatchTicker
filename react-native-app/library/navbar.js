import React from 'react';
import { StyleSheet, View, AsyncStorage } from 'react-native';
import ajaxWrapper from '../base/ajax.js';
import { Toast, Container, Header, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Text, Card, CheckBox, CardItem, List, ListItem, InputGroup, Input, Spinner } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';

class NavBar extends React.Component {

    render() {
      backButton = <Button onPress={() => this.props.setGlobalState('page',this.props.backPage)} transparent>
                <Icon name='chevron-left' style={{'color':'white', fontSize: 20}} />
              </Button>;
      if (this.props.back == false) {
          backButton = <View></View>;
      }
      if (this.props.logOut) {
        var logOutAction = <Button onPress={() => this.props.logOut()} transparent>
                  <Icon name='sign-out' style={{'color':'white'}} />
                </Button>;;
      }
      else {
        var logOutAction=<View></View>;
      }

      return (<Header style={{backgroundColor: '#bb81b8'}}>
            <Left>
              {backButton}
            </Left>
            <Body>
              <Title style={{'fontFamily':'Quicksand', color:'white'}}>{this.props.title}</Title>
            </Body>
          </Header>
        )
    }
}

export default NavBar;
