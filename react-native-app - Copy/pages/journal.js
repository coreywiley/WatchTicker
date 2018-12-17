import React from 'react';
import { StyleSheet, View, AsyncStorage, Image, ScrollView, PanResponder, Animated, Dimensions, PixelRatio, TouchableWithoutFeedback } from 'react-native';
import ajaxWrapper from '../base/ajax.js';
import { Form, Container, Header, Title, Content, Footer, FooterTab, Left, Right, Body, Card, CheckBox, CardItem, List, ListItem, InputGroup, Input, Spinner, Item, Label, Textarea} from 'native-base';
import ButtonSelect from '../library/buttonSelect.js';
import JournalCard from '../localLibrary/journalCard.js';
import {LinearGradient} from 'expo';
import Button from '../localLibrary/button.js';
import SelectionBox from '../localLibrary/selectionBox.js';
import Text from '../library/text.js';
import Loading from '../library/loading.js';

const Keyboard = require('Keyboard');

var symptom_1_selected = require('../assets/Customization/Symptoms/1_selected.png')
var symptom_2_selected = require('../assets/Customization/Symptoms/2_selected.png')
var symptom_3_selected = require('../assets/Customization/Symptoms/3_selected.png')
var symptom_4_selected = require('../assets/Customization/Symptoms/4_selected.png')
var symptom_5_selected = require('../assets/Customization/Symptoms/5_selected.png')
var symptom_6_selected = require('../assets/Customization/Symptoms/6_selected.png')
var symptom_7_selected = require('../assets/Customization/Symptoms/7_selected.png')
var symptom_8_selected = require('../assets/Customization/Symptoms/8_selected.png')
var symptom_9_selected = require('../assets/Customization/Symptoms/9_selected.png')
var symptom_10_selected = require('../assets/Customization/Symptoms/10_selected.png')
var symptom_11_selected = require('../assets/Customization/Symptoms/11_selected.png')
var symptom_12_selected = require('../assets/Customization/Symptoms/12_selected.png')

var symptom_1 = require('../assets/Customization/Symptoms/1.png')
var symptom_2 = require('../assets/Customization/Symptoms/2.png')
var symptom_3 = require('../assets/Customization/Symptoms/3.png')
var symptom_4 = require('../assets/Customization/Symptoms/4.png')
var symptom_5 = require('../assets/Customization/Symptoms/5.png')
var symptom_6 = require('../assets/Customization/Symptoms/6.png')
var symptom_7 = require('../assets/Customization/Symptoms/7.png')
var symptom_8 = require('../assets/Customization/Symptoms/8.png')
var symptom_9 = require('../assets/Customization/Symptoms/9.png')
var symptom_10 = require('../assets/Customization/Symptoms/10.png')
var symptom_11 = require('../assets/Customization/Symptoms/11.png')
var symptom_12 = require('../assets/Customization/Symptoms/12.png')

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

class Draggable extends React.Component {
    constructor(props){
      super(props);

      this.state = {
          pan     : new Animated.ValueXY(),
          x: this.props.x_coord,
          y: this.props.y_coord,
          symptom: this.props.symptom,
      };

      this.panResponder = PanResponder.create({    //Step 2
          onStartShouldSetPanResponder : () => true,
          onPanResponderMove           : Animated.event([null,{ //Step 3
              dx : this.state.pan.x,
              dy : this.state.pan.y
          }]),
          onPanResponderRelease        : (e, gesture) => {
              this.state.pan.setOffset({x: this.state.x + gesture['dx'], y: this.state.y + gesture['dy']})

              this.setState({'x':this.state.x + gesture['dx'], y: this.state.y + gesture['dy']}, this.props.setSymptomCoords(this.props.name,this.state.x + gesture['dx'],this.state.y + gesture['dy'], this.props.symptom))
              this.state.pan.setValue({x:0,y:0})
          } //Step 4
      });
  }

  componentDidMount() {
    this.state.pan.setValue({x:this.props.x_coord,y:this.props.y_coord})
    this.state.pan.setOffset({x: this.props.x_coord, y: this.props.y_coord})
  }

  render() {
        return (
            <View style={{'position':'absolute','left':0,'top':0}}>
                <Animated.View {...this.panResponder.panHandlers} style={this.state.pan.getLayout()}>
                    <Image source={symptomDict[this.state.symptom]} style={{width: 50,height:50, right:0, 'alignSelf':'flex-end', 'justifySelf':'flex-end','zIndex':10000}} resizeMode="contain" />
                </Animated.View>
            </View>
        );
    }
}

class Journal extends React.Component {
  constructor(props) {
      super(props);
      if (this.props.journal) {

        var symptoms = [];
        var symptom_details = {};

        for (var index in this.props.journal.symptoms) {
          var symptom = this.props.journal.symptoms[index].symptom;
          symptoms.push(symptom.symptom);
          symptom_details[symptom.symptom] = symptom
        }

        this.state = {keyboard:false, 'symptoms' : symptoms, 'symptom_details': symptom_details, 'notes': this.props.journal.notes, 'date':this.props.journal.date, 'id': this.props.journal.id, 'user': this.props.userId, loaded:false, 'customize':{}};
      }
      else {

        var today = new Date();
        var date = (today.getYear() + 1900) + '-' + (today.getMonth() + 1) + '-' + today.getDate()
        var display_date = (today.getMonth() + 1) + ' ' + today.getDate() + ' ' + (today.getYear() + 1900)
        this.state = {'symptoms' : '', 'date':date, 'display_date': display_date, 'symptom_details': {}, 'notes': '', 'user': this.props.userId, loaded:false, 'customize':{}, keyboard:false};
      }

      this.objectCallback = this.objectCallback.bind(this);
      this.handleChange = this.handleChange.bind(this);
      this.save = this.save.bind(this);
      this.addSymptoms = this.addSymptoms.bind(this);
      this.setSymptomCoords = this.setSymptomCoords.bind(this);
      this.resetSymptoms = this.resetSymptoms.bind(this);
      this.deleteEntry = this.deleteEntry.bind(this);
      //this.keyboardDidHide = this.keyboardDidHide.bind(this);
      //this.keyboardDidShow = this.keyboardDidShow.bind(this);
  }

    componentDidMount(value) {
        ajaxWrapper('GET','/api/home/customize/?user=' + this.props.userId, {}, this.objectCallback);
    }


    handleChange(name,value, multi=false) {
        var newState = {};

        if (multi) {
          newState['symptom_details'] = this.state.symptom_details;

          if (this.state[name] == '') {
            var newValue = [];
          }
          else {
            if (typeof(this.state[name]) == 'string') {
              var newValue = JSON.parse(this.state.answer)
            }
            else {
              var newValue = this.state[name];
            }
          }

          var index = newValue.indexOf(value)
          if (index == -1) {
            newValue.push(value);

            var width = Dimensions.get('window').width;

            var height = Dimensions.get('window').height;
            newState['symptom_details'][value] = {'x_coord':parseInt(width*.1), 'y_coord':parseInt(height*.2), 'symptom':value}
          }
          else {
            newValue.splice(index,1)
            if (newState['symptom_details'][index]['id']) {
              ajaxWrapper('POST','/api/home/symptom/' + newState['symptom_details'][index]['id'] + '/delete/',{},console.log)
            }
            delete newState['symptom_details'][index]
          }

          newState[name] = newValue;
        }
        else {
          newState[name] = value;
        }


        this.setState(newState);
    }

    objectCallback(result) {
      var newState = {}
      if (result.length > 0) {
        newState['customize'] = result[0]['customize'];
      }


      newState['loaded'] = true;

      this.setState(newState)
    }

    save() {

      var submitUrl = '/api/home/journal/';
      if (this.state.id) {
        submitUrl += this.state.id + '/';
      }
      var data = this.state;
      data['user'] = this.props.userId;
      console.log("Save", submitUrl, data)
      ajaxWrapper('POST',submitUrl, data, this.addSymptoms)
    }

    addSymptoms(result) {
      console.log("Journal", result[0])
      if (result[0]) {
        console.log("Made it", result[0], this.state.symptom_details)
        var journal_id = result[0]['journal']['id'];
        var width = parseInt(Dimensions.get('window').width);
        var height = parseInt(Dimensions.get('window').height);

        for (index in this.state.symptom_details) {
          console.log("Index", index)

          var submitUrl = '/api/home/symptom/';
          var symptom = this.state.symptom_details[index];
          console.log("Symptom", symptom)
          symptom['screen_width'] = width;
          symptom['screen_height'] = height;
          console.log("Symptom", symptom)
          symptom['x_coord'] = parseInt(symptom['x_coord'])
          symptom['y_coord'] = parseInt(symptom['y_coord'])
          console.log("Here")
          if (symptom['id']) {
            submitUrl += symptom['id'] + '/';
          }

          symptom['journal'] = journal_id
          console.log("Symptom POSTING", submitUrl, symptom)
          ajaxWrapper('POST',submitUrl, symptom, console.log)
        }

        this.props.setGlobalState('page','journalEntries');
      }
    }

    setSymptomCoords(name, x, y, symptom) {
      var symptom_details = this.state.symptom_details;
      symptom_details[name] = {'x_coord': parseInt(x), 'y_coord': parseInt(y), 'symptom':symptom}

      this.setState({'symptom_details':symptom_details})
    }

    resetSymptoms() {
      for (var index in this.state.symptom_details) {
        var symptom = this.state.symptom_details[index];
        if (symptom.id) {
          ajaxWrapper('POST','/api/home/symptom/' + symptom.id + '/delete/', {}, console.log);
        }
      }
      this.setState({'symptoms' : '', symptom_details: {}})
    }

    deleteEntry() {
      ajaxWrapper('POST','/api/home/journal/' + this.props.journal.id + '/delete/',{}, () => this.props.setGlobalState('page','journalEntries'))
    }

    render() {

              if (this.state.loaded) {

                var symptom_options = [
                  {'source':symptom_1,'selected_source':symptom_1_selected,'value':'Nipple Crust'},
                  {'source':symptom_2,'selected_source':symptom_2_selected,'value':'Discharge'},
                  {'source':symptom_3,'selected_source':symptom_3_selected,'value':'Texture'},
                  {'source':symptom_4,'selected_source':symptom_4_selected,'value':'Redness or Heat'},
                  {'source':symptom_5,'selected_source':symptom_5_selected,'value':'Pulled in Nipple'},
                  {'source':symptom_6,'selected_source':symptom_6_selected,'value':'Growing Vein'},
                  {'source':symptom_7,'selected_source':symptom_7_selected,'value':'New Shape or Size'},
                  {'source':symptom_8,'selected_source':symptom_8_selected,'value':'Indentation'},
                  {'source':symptom_9,'selected_source':symptom_9_selected,'value':'Thick Mass'},
                  {'source':symptom_10,'selected_source':symptom_10_selected,'value':'Skin Sores'},
                  {'source':symptom_11,'selected_source':symptom_11_selected,'value':'Bump'},
                  {'source':symptom_12,'selected_source':symptom_12_selected,'value':'Hard Lump'}]


                var text = this.state.notes;
                if (text == '') {
                  text = 'Please record details in this note such as size (pea, quarter, etc.) color, texture, or temperature.'
                }
                var notes = <View style={{'width':'100%', alignItems:'center', justifyContent:'center', marginTop:20}}>
                <TouchableWithoutFeedback onPress={() => this.setState({keyboard:true})}>
                <View style={{'width':'100%', alignItems:'center', justifyContent:'center'}}>
                  <View style={{'backgroundColor': 'white', 'width':'80%', 'padding':10, borderTopLeftRadius: 25, borderTopRightRadius: 25}} >
                  <Text style={{'color':'#a657a2', 'textAlign':'center'}}>Subject</Text>
                  </View>
                  <LinearGradient colors={['#bbb','#fff','#fff']} style={{'backgroundColor': 'white', 'width':'80%', 'padding':20,  alignItems:'center', justifyContent:'center', borderBottomLeftRadius: 25, borderBottomRightRadius: 25, flexDirection: 'row', flexWrap: 'wrap'}}>
                    <Text style={{'width':'100%', 'color': '#56c0a6', 'fontFamily':'Quicksand'}}>{text}</Text>
                  </LinearGradient>
                  </View>
                  </TouchableWithoutFeedback>
                </View>

                if (this.state.keyboard) {
                  var notes = <View style={{'width':'100%', alignItems:'center', justifyContent:'center', marginTop:20}}>
                    <View style={{'backgroundColor': 'white', 'width':'80%', 'padding':10, borderTopLeftRadius: 25, borderTopRightRadius: 25}} >
                    <Text style={{'color':'#a657a2', 'textAlign':'center'}}>Subject</Text>
                    </View>
                    <LinearGradient colors={['#bbb','#fff','#fff']} style={{'backgroundColor': 'white', 'width':'80%', 'padding':20,  alignItems:'center', justifyContent:'center', borderBottomLeftRadius: 25, borderBottomRightRadius: 25, flexDirection: 'row', flexWrap: 'wrap'}}>
                      <Textarea style={{'width':'100%', 'color': '#56c0a6', 'fontFamily':'Quicksand'}} placeholderTextColor={'#56c0a6'} placeholder={'Please record details in this note such as size (pea, quarter, etc.) color, texture, or temperature.'} onChangeText={(text) => this.handleChange('notes',text)} value={this.state.notes} rowSpan={8} />
                      <Button selected={true} text={'Save'} onPress={() => this.setState({'keyboard':false})} />

                    </LinearGradient>

                  </View>
                }

                var title_text = 'n  e  w    e  n  t  r  y';
                var delete_option = null;
                if (this.props.journal) {
                  title_text = 'e  d  i  t    e  n  t  r  y';
                  delete_option =<TouchableWithoutFeedback onPress={() => this.setState({'delete':true})}>
                    <Text style={{'color':'white', paddingBottom:5, borderColor:'white',borderBottomWidth:1, margin:10}}>Delete Entry</Text>
                  </TouchableWithoutFeedback>;
                }



                var draggable_symptoms = [];

                if (this.state.symptom_details) {
                  for (index in this.state.symptom_details) {
                    var symptom = this.state.symptom_details[index];

                    draggable_symptoms.push(<Draggable x_coord={symptom['x_coord']} y_coord={symptom['y_coord']} name={index} setSymptomCoords={this.setSymptomCoords} symptom={symptom['symptom']} />)
                  }
                }

                if (this.state.keyboard) {
                  return (
                      <View>
                      <LinearGradient
                        colors={['#52bfa6', '#3e8797']}
                        style={{alignItems: 'center', 'height':'100%', 'width':'100%'}}>
                            {notes}
                        </LinearGradient>
                      </View>
                  );
                }
                else if (this.state.delete) {
                  return (
                  <LinearGradient
                    colors={['#bd83b9', '#7d5d9b']}
                    style={{alignItems: 'center', 'height':'100%', 'width':'100%'}}>
                      <Text style={{'color':'white', marginTop: '20%', width:'60%', textAlign:'center', lineHeight:30}}>Are you sure you want to delete this entry?</Text>


                      <View style={{'width':'80%', marginTop:60}} >
                        <Button width={'95%'} onPress={this.save} text={"No, Let's Keep It"} onPress={() => this.setState({'delete':false})}/>
                      </View>

                      <View style={{'width':'80%'}} >
                        <Button width={'95%'} onPress={this.save} text={"Yes, Delete It"} onPress={this.deleteEntry}/>
                      </View>
                    </LinearGradient>
                  )
                }
                else {
                  console.log("Symptoms", this.state.symptoms)
                  return (
                      <ScrollView keyboardDismissMode='none'>
                      <LinearGradient
                        colors={['#52bfa6', '#3e8797']}
                        style={{alignItems: 'center', 'height':'100%', 'width':'100%'}}>
                        {draggable_symptoms}
                        <Text style={{'color':'white', marginTop: '4%'}}>{title_text}</Text>

                        <JournalCard customize={this.props.customize} journal={this.state} symptom_details={this.state.symptom_details} summarize={false} setSymptomCoords={this.setSymptomCoords} />

                        <TouchableWithoutFeedback onPress={this.resetSymptoms}>
                          <Text style={{'color':'white', borderColor:'white', borderBottomWidth:2, paddingBottom:2, textAlign:'center'}}>Reset Symptoms</Text>
                        </TouchableWithoutFeedback>

                        <SelectionBox multi={true} title={'Symptoms'} answer={this.state.symptoms} size={['30%',100]} selected_size={['30%',100]} handleChange={this.handleChange} name={'symptoms'} options={symptom_options} />

                        <View style={{'width':'80%', marginTop:20, height:20, alignItems:'center', 'justifyContent':'center'}}>
                          <View style={{'borderTopWidth':2, borderColor:'white', 'width':'100%'}}>
                          </View>

                          <Text style={{fontFamily: 'Quicksand', color:'white', position:'absolute', paddingRight:20, paddingLeft:20, backgroundColor:'#418f99', 'textAlign':'center', zIndex:1000}}>Add Notes</Text>
                        </View>

                            {notes}

                            <Button success={true} onPress={this.save} text={'Save Edits'} />

                            <TouchableWithoutFeedback onPress={() => this.props.setGlobalState('page','journalEntries')}>
                              <Text style={{'color':'white', paddingBottom:5, borderColor:'white',borderBottomWidth:1, margin:10}}>Go Back</Text>
                            </TouchableWithoutFeedback>

                            {delete_option}
                        </LinearGradient>
                      </ScrollView>
                  );
                }


              }
              else {
                return (
                  <Loading />
                );
              }

          }
      }

      export default Journal;
