import React from 'react';
import { StyleSheet, View, Image, TouchableWithoutFeedback, ScrollView } from 'react-native';
import ajaxWrapper from '../base/ajax.js';
import { Toast, Container, Header, Title, Content, FooterTab, Left, Right, Body, Card, CheckBox, CardItem, List, ListItem, InputGroup, Input, Spinner } from 'native-base';
import LeagueCard from '../localLibrary/leagueCard.js';
import CMCard from '../library/card.js';
import CustomPhoto from '../localLibrary/customPhoto.js';
import {LinearGradient} from 'expo';
import Text from '../library/text.js';
import Button from '../localLibrary/button.js';
import Footer from '../localLibrary/footer.js';
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';

var instructions_1 = require('../assets/resources_1.png')
var instructions_2 = require('../assets/resources_2.png')
var instructions_3 = require('../assets/resources_03.png')
var instructions_4 = require('../assets/resources_04.png')
var instructions_5 = require('../assets/resources_05.png')

class Journals extends React.Component {
  constructor(props) {
        super(props);

        var instructions = [
          ["The best time to do a breast self-exam is a 4-5 days after the last day of your menstrual period, when your hormonal cycle has the least impact on your breast tissue. For women who are postmenopausal, pick a day of the month that is easy for your to remember to do your exam.",instructions_1],
          ["Observe your breasts in the mirror with your hands on your hips. Look for any dimpling, redness, nipple disharge, or lumps and bumps. Turn left and right, then raise your arms and repeat your observations.",instructions_2],
          ["Standing up in front of a mirror, in the showing, or laying down, feel your left breast using your right hand. With the pads of your first three fingers, move in small, quarter-size cirlces all the way around the breast, starting from outside (under the armpit) nad moving into the center (sternum).",instructions_3],
          ["Make sure to cover the entire breast, up towards the collarbone and under the armpit. Your lymphatic system is located under your armpit and is a very common place for abnormalities to develop. Repeast this same motion on your right breast with your left hand.",instructions_4],
          ["While feeling for any lumps or bumps are important, also make sure to feel for an irregular orange peel-like texture around the breast and up towards the collar bone. This texture can often be caused by irriation of the lymphatic system and is a sign that something isn't normal.",instructions_5],
        ];


        this.state = {
          instructions: instructions,
          loaded:true,
          currentIndex: 0,
        };

        this.prev = this.prev.bind(this);
        this.next = this.next.bind(this);

      }

    prev() {
      if (this.state.currentIndex < this.state.instructions.length - 1) {
        this.setState({currentIndex: this.state.currentIndex + 1})
      }
    }

    next() {
      if (this.state.currentIndex > 0) {
        this.setState({currentIndex: this.state.currentIndex - 1})
      }
    }

    render() {

      if (this.state.loaded == false) {
        return (
          <View style={styles.container}>
            <Text>Loading...</Text>
          </View>
        );
      }

      else {

      var instruction = this.state.instructions[this.state.currentIndex];

      var circles = [];
      for (var i = 0; i < this.state.instructions.length; i++) {
        var color = '#4baea1';
        if (i != this.state.currentIndex) {
          color = '#fff';
        }
        circles.push(<View style={{'backgroundColor':color, height: 6, width:6, borderRadius:3, margin:3}}></View>)
      }

      const config = {
        velocityThreshold: 0.3,
        directionalOffsetThreshold: 80
      };

      return (
        <View>

        <LinearGradient
          colors={['#bd83b9', '#7d5d9b']}
          style={{alignItems: 'center', 'height':'100%', 'width':'100%'}}>

          <ScrollView style={{'height':'100%', 'width':'100%'}}>
          <View style={{alignItems:'center', justifyContent:'center'}}>
          <Text style={{'color':'white', marginTop: 20}}>r  e  s  o  u  r  c  e  s</Text>

          <View style={{'width':'80%', height:'60%', marginBottom:30}}>
          <GestureRecognizer
            onSwipeLeft={(state) => this.prev()}
            onSwipeRight={(state) => this.next()}
            config={config}
            style={{'width':'100%', height: '100%', 'alignItems':'center', 'justifyContent':'center', backgroundColor:'white', borderRadius:25, marginTop:20}}>

            <View style={{'width':'80%', backgroundColor:'white', borderRadius:25, height: 300, alignItems:'center',justifyContent:'center', marginTop:20, zIndex:10}} resizeMode={"contain"}>
              <Image source={this.state.instructions[this.state.currentIndex][1]} style={{width: '90%'}} style={{margin:0, width: '100%','height':'100%', 'position':'absolute', top:10}} />
              </View>

            <Text style={{color:'#ad5cb6', padding:20}}>{this.state.instructions[this.state.currentIndex][0]}</Text>


            </GestureRecognizer>
            </View>
            <View style={{'flexDirection':'row', 'flexWrap':'wrap','alignItems':'flex-start', 'marginTop':10}}>
              {circles}
            </View>

            <Button text={'FAQs'} width={'70%'} onPress={() => this.props.setGlobalState('page','faqs')} />
            <Button text={'Breast Cancer Signs'} width={'70%'} onPress={() => this.props.setGlobalState('page','faqs')} />
            <Button text={'Local Resouces'} width={'70%'} onPress={() => this.props.setGlobalState('page','faqs')} />


          <View style={{marginBottom:100}} />
          </View>
          </ScrollView>
          <Footer setGlobalState={this.props.setGlobalState} page={'journalEntries'} />

        </LinearGradient>

        </View>
        )
    }
  }
}

export default Journals;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
