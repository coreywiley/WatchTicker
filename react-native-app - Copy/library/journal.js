import React from 'react';
import { StyleSheet, View, AsyncStorage, Image, ScrollView, PanResponder, Animated} from 'react-native';
import ajaxWrapper from '../base/ajax.js';
import { Form, Container, Header, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Text, Card, CheckBox, CardItem, List, ListItem, InputGroup, Input, Spinner, Item, Label, Textarea} from 'native-base';
import ButtonSelect from '../library/buttonSelect.js';
import Loading from '../library/loading.js';

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

  render(){
        return (
            <View style={{'position':'absolute','left':0,'top':0}}>
                <Animated.View {...this.panResponder.panHandlers} style={this.state.pan.getLayout()}>
                    <Text>{this.props.name}</Text>
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
        this.state = {'symptoms' : symptoms, 'symptom_details': symptom_details, 'notes': this.props.journal.notes, 'id': this.props.journal.id, 'user': this.props.userId, loaded:false, 'customize':{}};
      }
      else {
        this.state = {'symptoms' : '', 'symptom_details': {}, 'notes': '', 'user': this.props.userId, loaded:false, 'customize':{}};
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
            newState['symptom_details'][value] = {'x_coord':0, 'y_coord':0, 'symptom':value}
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

                var symptom_options = ['Nipple Crust','Discharge','Texture','Growing Vein'];

                var pickerItems = [];
                for (var index in symptom_options) {
                  var value = symptom_options[index];
                  pickerItems.push(<Item><ButtonSelect multi={true} answer={this.state.symptoms} handleChange={this.handleChange} name={'symptoms'} value={value}/></Item>)
                }

                var symptoms = <View>
                  {pickerItems}
                </View>;

                var notes = <Item><Textarea style={{'width':'100%'}} onChangeText={(text) => this.handleChange('notes',text)} value={this.state.notes} rowSpan={3} bordered /></Item>;

                var draggable_symptoms = [];

                for (index in this.state.symptom_details) {
                  var symptom = this.state.symptom_details[index];
                  console.log("Draggable Symptom In For Loop", symptom, symptom['symptom'])
                  draggable_symptoms.push(<Draggable x_coord={symptom['x_coord']} y_coord={symptom['y_coord']} name={index} setSymptomCoords={this.setSymptomCoords} symptom={symptom['symptom']} />)
                }

                return (
                    <ScrollView>
                    <Image source={require('../assets/home.png')}  style={{height: 400, width: 600, flex: 1}}/>
                    {draggable_symptoms}
                        <View>
                          <Text>Symptoms</Text>
                          {symptoms}
                        </View>

                        <Text>Notes</Text>
                        {notes}
                        <View>
                          <Button success={true} onPress={this.save} full>
                            <Text>Save Edits</Text>
                          </Button>
                        </View>
                        
                    </ScrollView>
                );
              }
              else {
                return (
                  <Loading />
                );
              }

          }
      }

      export default Journal;
