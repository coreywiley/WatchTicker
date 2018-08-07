import React from 'react';
import { StyleSheet, View } from 'react-native';
import ajaxWrapper from '../base/ajax.js';
import { Toast, Container, Header, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Text, Card, CheckBox, CardItem, List, ListItem, InputGroup, Input, Spinner } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import CMCard from '../library/card.js';

class AddLeague extends React.Component {

    render() {

      return (
        <Content>
        <Text>
        {"\n"}
        </Text>
          <Button full success onPress={() => this.props.setGlobalState('page','joinLeague')}>
              <Text>Join A League</Text>
            </Button>
            <Text>
            {"\n"}
            </Text>
            <Button full primary onPress={() => this.props.setGlobalState('page','createLeague')}>
              <Text>Create A New League</Text>
            </Button>
          </Content>
        )
    }
}

export default AddLeague;
