import React from 'react';
import { StyleSheet, View, Image } from 'react-native';
import ajaxWrapper from '../base/ajax.js';
import { Toast, Container, Header, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Text, Card, CheckBox, CardItem, List, ListItem, InputGroup, Input, Spinner } from 'native-base';
import {LinearGradient} from 'expo';

var logo = require('../assets/Norma_1.png')

class Loading extends React.Component {
    render() {

      return (
        <LinearGradient
          colors={['#bd83b9', '#7d5d9b']}
          style={{alignItems: 'center', 'height':'100%', 'width':'100%'}}>

            <Image source={logo} style={{width:'60%', 'height':'23%', marginTop:'25%'}} />

          </LinearGradient>

      )
    }
}

export default Loading;
