import React from 'react';
import { StyleSheet, View } from 'react-native';
import ajaxWrapper from '../base/ajax.js';
import { Toast, Container, Header, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Text, Card, CheckBox, CardItem, List, ListItem, InputGroup, Input, Spinner } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';

class CMCard extends React.Component {
    render() {

      var style = {};
      if (this.props.style) {
        style = this.props.style;
      }
      style['fontFamily'] = 'Quicksand'

      return (<Text {...this.props} style={style}>{this.props.children}</Text>)
    }
}

export default CMCard;
