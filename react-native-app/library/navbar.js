import React from 'react';
import { StyleSheet, View, AsyncStorage } from 'react-native';
import ajaxWrapper from '../base/ajax.js';
import { Toast, Container, Header, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Text, Card, CheckBox, CardItem, List, ListItem, InputGroup, Input, Spinner } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';

class NavBar extends React.Component {

    render() {
      backButton = <Button onPress={() => this.props.setGlobalState('page',this.props.backPage)} transparent>
                <Icon name='chevron-left' style={{'color':'white'}} />
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

      return (<Header>
            <Left>
              {backButton}
            </Left>
            <Body>
              <Title>{this.props.title}</Title>
            </Body>
            <Right>
              {logOutAction}
            </Right>
          </Header>
        )
    }
}

export default NavBar;
