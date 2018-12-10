import React from 'react';
import { StyleSheet, View, AsyncStorage, Image } from 'react-native';
import ajaxWrapper from '../base/ajax.js';
import { Toast, Container, Header, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Text, Card, CheckBox, CardItem, List, ListItem, InputGroup, Input, Spinner } from 'native-base';

var back = require('../assets/back.png')

class NavBar extends React.Component {

    render() {
      backButton = <Button onPress={() => this.props.setGlobalState('page',this.props.backPage)} transparent>
                <Image source={back} style={{width: 60,height:30}} resizeMode="contain" />
              </Button>;
      if (this.props.back == false) {
          backButton = <View></View>;
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
