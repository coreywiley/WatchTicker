import React from 'react';
import {Image, StyleSheet, View, AsyncStorage } from 'react-native';
import ajaxWrapper from '../base/ajax.js';
import {Form, Button, Container, Header, Title, Content, Footer, FooterTab, Left, Right, Body, Text, Card, CheckBox, CardItem, List, ListItem, InputGroup, Input, Spinner, Item, Label, Textarea} from 'native-base';
import ButtonSelect from '../library/buttonSelect.js';
import {LinearGradient} from 'expo';

class NormaFooter extends React.Component {

  render() {

    var backgroundColor = '#c8b8d4';
    if (this.props.backgroundColor) {
      backgroundColor = this.props.backgroundColor;
    }

    console.log("Background Color", backgroundColor)

    if (this.props.page == 'journalEntries') {
      return (
        <Footer style={{'position':'absolute', 'bottom':0, 'width':'100%', 'backgroundColor': backgroundColor}}>
            <FooterTab style={{'backgroundColor': backgroundColor, 'width':'100%'}}>
              <Button onPress={() => this.props.setGlobalState('page','journalEntries')}>
                <Image source={require('../assets/Customization/journal.png')} style= {{flex:1 , width: 60, height: 20}}/>
              </Button>
              <Button onPress={() => this.props.setGlobalState('page','resources')} style={{'borderRightWidth':1, 'borderRightColor':'#ae6dac','borderLeftWidth':1, 'borderLeftColor':'#ae6dac'}}>
                <Image source={require('../assets/Customization/resources.png')} style= {{flex:1 , width: 60, height: 60}} />
              </Button>
              <Button onPress={() => this.props.setGlobalState('page','doctors')} style={{'borderRightWidth':1, 'borderRightColor':'#ae6dac'}}>
              <Image source={require('../assets/Customization/my_health.png')}  style= {{flex:1 , width: 60, height: 60}}/>
              </Button>
              <Button onPress={() => this.props.setGlobalState('page','settings')}>
              <Image source={require('../assets/Customization/settings.png')}  style= {{flex:1 , width: 60, height: 70}}/>
              </Button>
            </FooterTab>
          </Footer>
      )
    }
    else {
      return (
        <Footer style={{'position':'absolute', 'bottom':0, 'width':'100%', 'backgroundColor': backgroundColor}}>
            <FooterTab style={{'backgroundColor': backgroundColor, 'width':'100%'}}>
              <Button onPress={this.props.prev}>
                <Image source={require('../assets/prev.png')} style= {{flex:1 , width: 60, height: 20}}/>
              </Button>
              <Button onPress={this.props.home} style={{'borderRightWidth':1, 'borderRightColor':'#ae6dac','borderLeftWidth':1, 'borderLeftColor':'#ae6dac'}}>
                <Image source={require('../assets/home.png')} style= {{flex:1 , width: 30, height: 75}} />
              </Button>
              <Button onPress={this.props.info}>
              <Image source={require('../assets/info.png')}  style= {{flex:1 , width: 65, height: 20}}/>
              </Button>
            </FooterTab>
          </Footer>
      )
    }

  }

}

export default NormaFooter;
//style={{height: 400, width: 600, flex: 1}}
