import React from 'react';
import { StyleSheet, View, ScrollView, Image, TouchableWithoutFeedback } from 'react-native';
import ajaxWrapper from '../base/ajax.js';
import { Toast, Container, Header, Title, Content, FooterTab, Left, Right, Body, Card, CheckBox, CardItem, List, ListItem, InputGroup, Input, Spinner, Textarea } from 'native-base';
import CMCard from '../library/card.js';
import Button from '../localLibrary/button.js';
import {LinearGradient} from 'expo';
import Text from '../library/text.js';
import Footer from '../localLibrary/footer.js';

class PrivacyPolicy extends React.Component {


    render() {


      return (
        <View>
          <View style={{width:'100%', backgroundColor: '#e6d8e8'}}>
            <Text style={{color:'#a657a1', margin:10,fontSize: 12}}>PRIVACY POLICY</Text>
          </View>


            <Text style={{margin:10}}>Lots of text.</Text>

        </View>
      )
    }



}

//'#6bc8b3' teal
//a657a1

export default PrivacyPolicy;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
