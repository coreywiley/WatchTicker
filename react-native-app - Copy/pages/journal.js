import React from 'react';
import { StyleSheet, View, AsyncStorage, Image, ScrollView, PanResponder, Animated} from 'react-native';
import ajaxWrapper from '../base/ajax.js';
import { Form, Container, Header, Title, Content, Footer, FooterTab, Left, Right, Body, Card, CheckBox, CardItem, List, ListItem, InputGroup, Input, Spinner, Item, Label, Textarea} from 'native-base';
import ButtonSelect from '../library/buttonSelect.js';
import JournalCard from '../localLibrary/journalCard.js';
import {LinearGradient} from 'expo';
import Button from '../localLibrary/button.js';
import SelectionBox from '../localLibrary/selectionBox.js';
import Text from '../library/text.js';

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
      console.log("Draggable", this.props)
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
              console.log("Submitting Pan Resonponder", this.state.symptom)
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
                    <Image source={symptomDict[this.state.symptom]} style={{marginLeft:'20%', width: 50,height:50, right:0, 'alignSelf':'flex-end', 'justifySelf':'flex-end','zIndex':10000}} resizeMode="contain" />
                </Animated.View>
            </View>
        );
    }
}

class Journal extends React.Component {
  constructor(props) {
      super(props);
      if (this.props.journal) {
        console.log("Journal", this.props.journal)
        var symptoms = [];
        var symptom_details = {};

        for (var index in this.props.journal.symptoms) {
          var symptom = this.props.journal.symptoms[index].symptom;
          symptoms.push(symptom.symptom);
          symptom_details[symptom.symptom] = symptom
        }
        console.log("Symptoms", symptoms, symptom_details)
        this.state = {'symptoms' : symptoms, 'symptom_details': symptom_details, 'notes': this.props.journal.notes, 'date':this.props.journal.date, 'id': this.props.journal.id, 'user': this.props.userId, loaded:false, 'cusomize':{}};
      }
      else {
        this.state = {'symptoms' : '', 'date':'11 16 2018', 'symptom_details': {}, 'notes': '', 'user': this.props.userId, loaded:false, 'cusomize':{}};
      }

      this.objectCallback = this.objectCallback.bind(this);
      this.handleChange = this.handleChange.bind(this);
      this.save = this.save.bind(this);
      this.addSymptoms = this.addSymptoms.bind(this);
      this.setSymptomCoords = this.setSymptomCoords.bind(this);
  }

    componentDidMount(value) {
        ajaxWrapper('GET','/api/home/customize/?user=' + this.props.userId, {}, this.objectCallback);
    }


    handleChange(name,value, multi=false) {
        var newState = {};
        console.log("Handle Change",name,value,multi)
        if (multi) {
          newState['symptom_details'] = this.state.symptom_details;
          console.log("Multi", value)
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
          console.log("New Value", newValue)
          var index = newValue.indexOf(value)
          if (index == -1) {
            newValue.push(value);
            newState['symptom_details'][value] = {'x_coord':50, 'y_coord':50, 'symptom':value}
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

        console.log("New State", newState)
        this.setState(newState);
    }

    objectCallback(result) {
      var newState = {}
      if (result.length > 0) {
        newState['customize'] = result[0]['customize'];
      }


      newState['loaded'] = true;
      console.log("Object Callback", newState)
      this.setState(newState)
    }

    save() {
      console.log("Saving Journal")
      var submitUrl = '/api/home/journal/';
      if (this.state.id) {
        submitUrl += this.state.id + '/';
      }
      var data = this.state;
      data['user'] = this.props.userId;
      console.log("Saving Journal", submitUrl, data)
      ajaxWrapper('POST',submitUrl, data, this.addSymptoms)
    }

    addSymptoms(result) {
      console.log("Adding Symptoms", result)
      console.log("Current Symptoms", this.state.symptom_details)
      var journal_id = result[0]['journal']['id'];

      for (index in this.state.symptom_details) {

        var submitUrl = '/api/home/symptom/';
        var symptom = this.state.symptom_details[index];
        console.log("Symptom", symptom)
        if (symptom['id']) {
          submitUrl += symptom['id'] + '/';
        }

        symptom['journal'] = journal_id
        ajaxWrapper('POST',submitUrl, symptom, console.log)
      }

      this.props.setGlobalState('page','journalEntries');
    }

    setSymptomCoords(name, x, y, symptom) {
      var symptom_details = this.state.symptom_details;
      symptom_details[name] = {'x_coord': parseInt(x), 'y_coord': parseInt(y), 'symptom':symptom}
      console.log("symptom_details", symptom_details)
      this.setState({'symptom_details':symptom_details})
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


                var notes = <View style={{'width':'100%', alignItems:'center', justifyContent:'center', marginTop:20}}>
                  <View style={{'backgroundColor': 'white', 'width':'80%', 'padding':10, borderTopLeftRadius: 25, borderTopRightRadius: 25}} >
                  <Text style={{'color':'#a657a2', 'textAlign':'center'}}>Subject</Text>
                  </View>
                  <LinearGradient colors={['#bbb','#fff','#fff']} style={{'backgroundColor': 'white', 'width':'80%', 'padding':20,  alignItems:'center', justifyContent:'center', borderBottomLeftRadius: 25, borderBottomRightRadius: 25, flexDirection: 'row', flexWrap: 'wrap'}}>
                    <Textarea style={{'width':'100%', 'color': '#56c0a6', 'fontFamily':'Quicksand'}} placeholder={'Please record details in this note such as size (pea, quarter, etc.) color, texture, or temperature.'} onChangeText={(text) => this.handleChange('notes',text)} value={this.state.notes} rowSpan={3} />
                  </LinearGradient>

                </View>

                var title_text = 'n  e  w    e  n  t  r  y';
                if (this.props.journal) {
                  title_text = 'e  d  i  t    e  n  t  r  y';
                }

                console.log("Symptom Details Journal", this.state.symptom_details)

                var draggable_symptoms = [];
                console.log("Symptom Details", this.state.symptom_details)
                if (this.state.symptom_details) {
                  for (index in this.state.symptom_details) {
                    var symptom = this.state.symptom_details[index];
                    console.log("Draggable Symptom In For Loop", symptom, symptom['symptom'])
                    draggable_symptoms.push(<Draggable x_coord={symptom['x_coord']} y_coord={symptom['y_coord']} name={index} setSymptomCoords={this.setSymptomCoords} symptom={symptom['symptom']} />)
                  }
                }

                return (
                    <ScrollView>
                    <LinearGradient
                      colors={['#52bfa6', '#3e8797']}
                      style={{alignItems: 'center', 'height':'100%', 'width':'100%'}}>

                      <Text style={{'color':'white', marginTop: 20}}>{title_text}</Text>

                      <JournalCard customize={this.props.customize} journal={this.state} symptom_details={this.state.symptom_details} summarize={false} setSymptomCoords={this.setSymptomCoords} />
                      {draggable_symptoms}

                      <SelectionBox title={'Symptoms'} answer={this.state.symptoms} size={['30%',100]} selected_size={['30%',100]} handleChange={this.handleChange} name={'symptoms'} options={symptom_options} />

                      <View style={{'width':'80%', marginTop:20, height:20, alignItems:'center', 'justifyContent':'center'}}>
                        <View style={{'borderTopWidth':2, borderColor:'white', 'width':'100%'}}>
                        </View>

                        <Text style={{fontFamily: 'Quicksand', color:'white', position:'absolute', paddingRight:20, paddingLeft:20, backgroundColor:'#418f99', 'textAlign':'center', zIndex:1000}}>Add Notes</Text>
                      </View>

                          {notes}

                          <Button success={true} onPress={this.save} text={'Save'} />

                      </LinearGradient>
                    </ScrollView>
                );
              }
              else {
                return (
                  <View>
                        <Text>Welcome To Journaling</Text>
                    </View>
                );
              }

          }
      }

      export default Journal;
