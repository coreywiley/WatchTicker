import React from 'react';
import { StyleSheet, View } from 'react-native';
import ajaxWrapper from '../base/ajax.js';
import { Toast, Container, Header, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Text, Card, CheckBox, CardItem, List, ListItem, InputGroup, Input, Spinner } from 'native-base';

class CMCard extends React.Component {
    render() {
      backButton = <Button onPress={() => this.buttonHandler()} transparent>
                <Icon name='chevron-left' />
              </Button>;
      if (this.props.back == false) {
          backButton = <View></View>;
      }

      return (<Card>

            <CardItem header>
              <Text>{this.props.title}</Text>
            </CardItem>
            <CardItem>
              <Body>
                {this.props.body}
              </Body>
            </CardItem>
          </Card>
        )
    }
}

export default CMCard;
