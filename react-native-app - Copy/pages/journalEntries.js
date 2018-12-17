import React from 'react';
import { StyleSheet, View, Image, TouchableWithoutFeedback } from 'react-native';
import ajaxWrapper from '../base/ajax.js';
import { Toast, Container, Header, Title, Content, FooterTab, Left, Right, Body, Card, CheckBox, CardItem, List, ListItem, InputGroup, Input, Spinner } from 'native-base';
import LeagueCard from '../localLibrary/leagueCard.js';
import CMCard from '../library/card.js';
import CustomPhoto from '../localLibrary/customPhoto.js';
import {LinearGradient} from 'expo';
import Text from '../library/text.js';
import Button from '../localLibrary/button.js';
import Footer from '../localLibrary/footer.js';
import Loading from '../library/loading.js';

import JournalCard from '../localLibrary/journalCard.js';

var add_entry = require('../assets/Customization/add.png')
var edit_entry = require('../assets/Customization/edit.png')

var symptom_1_drag = require('../assets/Customization/Symptoms/1_drag.png')
var symptom_2_drag = require('../assets/Customization/Symptoms/2_drag.png')
var symptom_3_drag = require('../assets/Customization/Symptoms/3_drag.png')
var symptom_4_drag = require('../assets/Customization/Symptoms/4_drag.png')
var symptom_5_drag = require('../assets/Customization/Symptoms/5_drag.png')
var symptom_6_drag = require('../assets/Customization/Symptoms/6_drag.png')
var symptom_7_drag = require('../assets/Customization/Symptoms/7_drag.png')
var symptom_8_drag = require('../assets/Customization/Symptoms/8_drag.png')
var symptom_9_drag = require('../assets/Customization/Symptoms/9_drag.png')
var symptom_10_drag = require('../assets/Customization/Symptoms/10_drag.png')
var symptom_11_drag = require('../assets/Customization/Symptoms/11_drag.png')
var symptom_12_drag = require('../assets/Customization/Symptoms/12_drag.png')

var symptomDict = {
  'Nipple Crust': symptom_1_drag,
  'Discharge': symptom_2_drag,
  'Texture': symptom_3_drag,
  'Redness or Heat': symptom_4_drag,
  'Pulled in Nipple': symptom_5_drag,
  'Growing Vein': symptom_6_drag,
  'New Shape or Size': symptom_7_drag,
  'Indentation': symptom_8_drag,
  'Thick Mass': symptom_9_drag,
  'Skin Sores': symptom_10_drag,
  'Bump': symptom_11_drag,
  'Hard Lump': symptom_12_drag,
}

class NotDraggable extends React.Component {

  render() {
    console.log("Rendering Symptom", this.props.symptom)
        return (
            <View style={{'position':'absolute','left':this.props.x_coord,'top':this.props.y_coord}}>
                <Image source={symptomDict[this.props.symptom]} style={{width: 50,height:50, right:0, 'alignSelf':'flex-end', 'justifySelf':'flex-end','zIndex':10000}} resizeMode="contain" />
            </View>
        );
    }
}

class Journals extends React.Component {
  constructor(props) {
        super(props);
        this.state = {
          journals: [],
          customize: null,
          loaded:false,
          currentIndex: 0,
          guide:0,
        };

        this.journalCallback = this.journalCallback.bind(this);
        this.chooseJournal = this.chooseJournal.bind(this);
        this.customizeCallback = this.customizeCallback.bind(this);
        this.prev = this.prev.bind(this);
        this.next = this.next.bind(this);
        this.updateMenstruationDay = this.updateMenstruationDay.bind(this);
        this.defaultJournal = this.defaultJournal.bind(this);

      }

      updateMenstruationDay() {
        this.props.setGlobalState('appointment', 'menstrual')
        this.props.setGlobalState('page','setNotification')
      }

    componentDidMount() {
      console.log("Running Ajax")
      ajaxWrapper('GET','/api/home/journal/?order_by=-id&related=symptoms&user=' + this.props.userId, {}, this.journalCallback)
      ajaxWrapper('GET','/api/home/customize/?user=' + this.props.userId, {}, this.customizeCallback)
    }

    journalCallback(result) {
      var journals = [];
      for (var index in result) {
        var journal = result[index]['journal'];
        journals.push(journal)
      }

      this.setState({journals:journals, loaded:true})
    }

    customizeCallback(result) {
      if (result.length > 0) {
      this.setState({customize: result[0]['customize']})
      }
      else {
        this.setState({customize: undefined})
      }
    }

    chooseJournal(journal) {
      this.props.setGlobalState('journal',journal);
      this.props.setGlobalState('customize', this.state.customize)
      this.props.setGlobalState('page','journal');
    }

    prev() {
      if (this.state.currentIndex < this.state.journals.length - 1) {
        this.setState({currentIndex: this.state.currentIndex + 1})
      }
    }

    next() {
      if (this.state.currentIndex > 0) {
        this.setState({currentIndex: this.state.currentIndex - 1})
      }
    }

    defaultJournal() {
      var customize = {'user':this.props.userId, 'skin_color':0, size: 0, nipple_color:0, masectomy:0}
      ajaxWrapper('POST', '/api/home/customize/', customize, () => this.setState({'customize':customize}))
    }

    render() {

      if (this.state.loaded == false) {
        return (
          <Loading />
        );
      }
      else if (this.state.customize == undefined) {
        return (
          <View>

            <LinearGradient
              colors={['#bd83b9', '#7d5d9b']}
              style={{alignItems: 'center', 'height':'100%', 'width':'100%'}}>

              <Text style={{'color':'white', marginTop: '4%'}}>m    y        j    o    u    r    n    a    l</Text>

              <View style={{'position':'absolute', top:'10%', width:'100%', alignItems:'center'}}>
                <CustomPhoto nipple_color={0} masectomy={0} size={0} skin_color={0} />
              </View>


              <Footer setGlobalState={this.props.setGlobalState} page={'journalEntries'} hide={true} />

            </LinearGradient>
            <View style={{flex: 1,position: 'absolute',left: 0,top: 0,opacity: 0.5,backgroundColor: 'white',width: '100%', height:'100%', zIndex:99999999999}} />

            <View style={{'width':"100%", 'alignItems':'center','justifyContent':'center', zIndex:99999999999999, position: 'absolute',top: '60%'}}>
              <LinearGradient
                colors={['#bd83b9', '#7d5d9b']}
                start={[0,0]}
                end={[1,0]}
                style={{alignItems: 'center', padding:10, width:'80%', borderRadius:25}}>
                  <Text style={{color:'white','textAlign':'center'}}>Before you complete your first entry, let's customize your journal to look like you.</Text>
              </LinearGradient>
              <View style={{'width':'60%'}} >
                <Button text={'Customize'} width={'95%'} onPress={() => this.props.setGlobalState('page','customize')}/>
              </View>
              <View style={{'width':'60%'}} >
                <Button text={"I'll keep the default"} width={'95%'} onPress={this.defaultJournal}/>
              </View>
            </View>
          </View>
          )

      }
      else if (this.state.journals.length == 0 && this.state.guide == 0) {
        return (
          <View style={{alignItems:'center',justifyContent:'center'}}>

            <LinearGradient
              colors={['#bd83b9', '#7d5d9b']}
              style={{alignItems: 'center', 'height':'100%', 'width':'100%'}}>

              <Text style={{'color':'white', marginTop: '4%'}}>m    y        j    o    u    r    n    a    l</Text>

              <View style={{'position':'absolute', top:'10%', width:'100%', alignItems:'center'}}>
                <JournalCard customize={this.state.customize} chooseJournal={this.chooseJournal} prev={this.prev} next={this.next} />
              </View>

              <Footer setGlobalState={this.props.setGlobalState} page={'journalEntries'} hide={true} />

            </LinearGradient>
            <View style={{flex: 1,position: 'absolute',left: 0,top: 0,opacity: 0.5,backgroundColor: 'white',width: '100%', height:'100%', zIndex:99999999999}} />

            <Image source={add_entry} style={{'position':'absolute', top:'14%', left:'80%', width: 50,height:50, zIndex:999999999999}}/>
            <View style={{'width':"75%", 'alignItems':'center','justifyContent':'center', zIndex:99999999999999, elevation:3, position: 'absolute',top: '30%', 'backgroundColor':'white', borderRadius:25, height:'30%'}}>
                  <Text style={{color:'#a657a1','textAlign':'center', height:'50%', marginTop:20}}>Add your first entry</Text>
                  <View style={{'width':'60%'}} >
                    <Button text={'Next'} width={'90%'} onPress={() => this.setState({'guide':1})}/>
                  </View>

            </View>
          </View>
          )
      }
      else if (this.state.journals.length == 0 && this.state.guide == 1) {
        return (
          <View style={{alignItems:'center',justifyContent:'center'}}>

            <LinearGradient
              colors={['#bd83b9', '#7d5d9b']}
              style={{alignItems: 'center', 'height':'100%', 'width':'100%'}}>

              <Text style={{'color':'white', marginTop: '4%'}}>m    y        j    o    u    r    n    a    l</Text>

              <View style={{'position':'absolute', top:'10%', width:'100%', alignItems:'center'}}>
                <JournalCard customize={this.state.customize} chooseJournal={this.chooseJournal} prev={this.prev} next={this.next} />
              </View>

              <Footer setGlobalState={this.props.setGlobalState} page={'journalEntries'} hide={true} highlight={'resources'}/>

            </LinearGradient>
            <View style={{flex: 1,position: 'absolute',left: 0,top: 0,opacity: 0.5,backgroundColor: 'white',width: '100%', height:'100%', zIndex:99999999999}} />

            <View style={{'width':"75%", 'alignItems':'center','justifyContent':'center', zIndex:99999999999999, elevation:3, position: 'absolute',top: '30%', 'backgroundColor':'white', borderRadius:25, height:'30%'}}>
                  <Text style={{color:'#a657a1','textAlign':'center', height:'50%', marginTop:20}}>Learn how to do a breast self-exam and discover breast resources in your area.</Text>
                  <View style={{'width':'60%'}} >
                    <Button text={'Next'} width={'90%'} onPress={() => this.setState({'guide':2})}/>
                  </View>

            </View>
          </View>
          )
      }
      else if (this.state.journals.length == 0 && this.state.guide == 2) {
        return (
          <View style={{alignItems:'center',justifyContent:'center'}}>

            <LinearGradient
              colors={['#bd83b9', '#7d5d9b']}
              style={{alignItems: 'center', 'height':'100%', 'width':'100%'}}>

              <Text style={{'color':'white', marginTop: '4%'}}>m    y        j    o    u    r    n    a    l</Text>

              <View style={{'position':'absolute', top:'10%', width:'100%', alignItems:'center'}}>
                <JournalCard customize={this.state.customize} chooseJournal={this.chooseJournal} prev={this.prev} next={this.next} />
              </View>

              <Footer setGlobalState={this.props.setGlobalState} page={'journalEntries'} hide={true} highlight={'health'}/>

            </LinearGradient>
            <View style={{flex: 1,position: 'absolute',left: 0,top: 0,opacity: 0.5,backgroundColor: 'white',width: '100%', height:'100%', zIndex:99999999999}} />

            <View style={{'width':"75%", 'alignItems':'center','justifyContent':'center', zIndex:99999999999999, elevation:3, position: 'absolute',top: '30%', 'backgroundColor':'white', borderRadius:25, height:'30%'}}>
                  <Text style={{color:'#a657a1','textAlign':'center', height:'50%', marginTop:20}}>Store your doctor's contact information, notes about past and upcoming appointments, and set appointment reminders.</Text>
                  <View style={{'width':'60%'}} >
                    <Button text={'Next'} width={'90%'} onPress={() => this.setState({'guide':3})}/>
                  </View>

            </View>
          </View>
          )
      }
      else {

      var journal = this.state.journals[this.state.currentIndex];

      var circles = [];
      for (var i = 0; i < this.state.journals.length; i++) {
        var color = '#4baea1';
        if (i > this.state.currentIndex) {
          color = '#fff';
        }
        circles.push(<View key={'circles_' + i} style={{'backgroundColor':color, height: 6, width:6, borderRadius:3, margin:3}}></View>)
      }

      if (journal) {
        var symptom_details = {};
        var symptoms = [];
        for (var index in journal.symptoms) {
          var symptom = journal.symptoms[index].symptom;
          symptom_details[symptom.symptom] = symptom
        }
        console.log("Symptom Details, Journal Entries", symptom_details)

        for (index in symptom_details) {
          var symptom = symptom_details[index];
          console.log("Symptom", symptom['x_coord'], symptom['y_coord'], symptom['symptom'])
          symptoms.push(<NotDraggable key={'symptom_' + index} x_coord={symptom['x_coord']} y_coord={symptom['y_coord']} symptom={symptom['symptom']} />)
        }
      }

      return (
        <View>
          <LinearGradient
            colors={['#bd83b9', '#7d5d9b']}
            style={{alignItems: 'center', 'height':'100%', 'width':'100%'}}>
            {symptoms}
            <Text style={{'color':'white', marginTop: '4%'}}>m    y        j    o    u    r    n    a    l</Text>

            <View style={{'position':'absolute', top:'10%', width:'100%'}}>
              <JournalCard customize={this.state.customize} chooseJournal={this.chooseJournal} journal={journal} prev={this.prev} next={this.next} />
            </View>

            <View style={{'position':'absolute', top:'75%', width:'100%', alignItems:'center', justifyContent:'center'}}>
              <Button width={'80%'} text={'Update last day of last menstrual cycle'} onPress={this.updateMenstruationDay} />
            </View>

            <View style={{'flexDirection':'row', 'flexWrap':'wrap','alignItems':'flex-start', 'position':'absolute', top:'85%'}}>
              {circles}
            </View>

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
