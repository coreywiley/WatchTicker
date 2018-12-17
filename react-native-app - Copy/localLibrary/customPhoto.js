import React from 'react';
import { StyleSheet, View, AsyncStorage, Image, ScrollView, PanResponder, Animated, TouchableWithoutFeedback} from 'react-native';
import ajaxWrapper from '../base/ajax.js';
import { Toast, Container, Header, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Text, Card, CheckBox, CardItem, List, ListItem, InputGroup, Input, Spinner } from 'native-base';


var skin_0 = require('../assets/Customization/default/default.png')
var skin_1 = require('../assets/Customization/Skin_1/body_1.png')
var skin_2 = require('../assets/Customization/Skin_2/body_2.png')
var skin_3 = require('../assets/Customization/Skin_3/body_3.png')
var skin_4 = require('../assets/Customization/Skin_4/body_4.png')
var skin_5 = require('../assets/Customization/Skin_5/body_5.png')
var skin_6 = require('../assets/Customization/Skin_6/body_6.png')
var skin_7 = require('../assets/Customization/Skin_7/body_7.png')

var nipple_1 = require('../assets/Customization/nipple_1.png')
var nipple_2 = require('../assets/Customization/nipple_2.png')
var nipple_3 = require('../assets/Customization/nipple_3.png')
var nipple_4 = require('../assets/Customization/nipple_4.png')
var nipple_5 = require('../assets/Customization/nipple_5.png')
var nipple_6 = require('../assets/Customization/nipple_6.png')

var skin_0_size_2_left = require('../assets/Customization/default/small_left.png')
var skin_0_size_2_right = require('../assets/Customization/default/small_right.png')
var skin_0_size_3_left = require('../assets/Customization/default/med_left.png')
var skin_0_size_3_right = require('../assets/Customization/default/med_right.png')
var skin_0_size_4_left = require('../assets/Customization/default/large_left.png')
var skin_0_size_4_right = require('../assets/Customization/default/large_right.png')

var skin_1_size_2_left = require('../assets/Customization/Skin_1/small_left.png')
var skin_1_size_2_right = require('../assets/Customization/Skin_1/small_right.png')
var skin_1_size_3_left = require('../assets/Customization/Skin_1/med_left.png')
var skin_1_size_3_right = require('../assets/Customization/Skin_1/med_right.png')
var skin_1_size_4_left = require('../assets/Customization/Skin_1/large_left.png')
var skin_1_size_4_right = require('../assets/Customization/Skin_1/large_right.png')

var skin_2_size_2_left = require('../assets/Customization/Skin_2/small_left.png')
var skin_2_size_2_right = require('../assets/Customization/Skin_2/small_right.png')
var skin_2_size_3_left = require('../assets/Customization/Skin_2/med_left.png')
var skin_2_size_3_right = require('../assets/Customization/Skin_2/med_right.png')
var skin_2_size_4_left = require('../assets/Customization/Skin_2/large_left.png')
var skin_2_size_4_right = require('../assets/Customization/Skin_2/large_right.png')

var skin_3_size_2_left = require('../assets/Customization/Skin_3/small_left.png')
var skin_3_size_2_right = require('../assets/Customization/Skin_3/small_right.png')
var skin_3_size_3_left = require('../assets/Customization/Skin_3/med_left.png')
var skin_3_size_3_right = require('../assets/Customization/Skin_3/med_right.png')
var skin_3_size_4_left = require('../assets/Customization/Skin_3/large_left.png')
var skin_3_size_4_right = require('../assets/Customization/Skin_3/large_right.png')

var skin_4_size_2_left = require('../assets/Customization/Skin_4/small_left.png')
var skin_4_size_2_right = require('../assets/Customization/Skin_4/small_right.png')
var skin_4_size_3_left = require('../assets/Customization/Skin_4/med_left.png')
var skin_4_size_3_right = require('../assets/Customization/Skin_4/med_right.png')
var skin_4_size_4_left = require('../assets/Customization/Skin_4/large_left.png')
var skin_4_size_4_right = require('../assets/Customization/Skin_4/large_right.png')

var skin_5_size_2_left = require('../assets/Customization/Skin_5/small_left.png')
var skin_5_size_2_right = require('../assets/Customization/Skin_5/small_right.png')
var skin_5_size_3_left = require('../assets/Customization/Skin_5/med_left.png')
var skin_5_size_3_right = require('../assets/Customization/Skin_5/med_right.png')
var skin_5_size_4_left = require('../assets/Customization/Skin_5/large_left.png')
var skin_5_size_4_right = require('../assets/Customization/Skin_5/large_right.png')

var skin_6_size_2_left = require('../assets/Customization/Skin_6/small_left.png')
var skin_6_size_2_right = require('../assets/Customization/Skin_6/small_right.png')
var skin_6_size_3_left = require('../assets/Customization/Skin_6/med_left.png')
var skin_6_size_3_right = require('../assets/Customization/Skin_6/med_right.png')
var skin_6_size_4_left = require('../assets/Customization/Skin_6/large_left.png')
var skin_6_size_4_right = require('../assets/Customization/Skin_6/large_right.png')

var skin_7_size_2_left = require('../assets/Customization/Skin_7/small_left.png')
var skin_7_size_2_right = require('../assets/Customization/Skin_7/small_right.png')
var skin_7_size_3_left = require('../assets/Customization/Skin_7/med_left.png')
var skin_7_size_3_right = require('../assets/Customization/Skin_7/med_right.png')
var skin_7_size_4_left = require('../assets/Customization/Skin_7/large_left.png')
var skin_7_size_4_right = require('../assets/Customization/Skin_7/large_right.png')

var skin_0_scar_left = require('../assets/Customization/default/scar_left.png')
var skin_0_scar_right = require('../assets/Customization/default/scar_right.png')
var skin_1_scar_left = require('../assets/Customization/Skin_1/scar_left.png')
var skin_1_scar_right = require('../assets/Customization/Skin_1/scar_right.png')
var skin_2_scar_left = require('../assets/Customization/Skin_2/scar_left.png')
var skin_2_scar_right = require('../assets/Customization/Skin_2/scar_right.png')
var skin_3_scar_left = require('../assets/Customization/Skin_3/scar_left.png')
var skin_3_scar_right = require('../assets/Customization/Skin_3/scar_right.png')
var skin_4_scar_left = require('../assets/Customization/Skin_4/scar_left.png')
var skin_4_scar_right = require('../assets/Customization/Skin_4/scar_right.png')
var skin_5_scar_left = require('../assets/Customization/Skin_5/scar_left.png')
var skin_5_scar_right = require('../assets/Customization/Skin_5/scar_right.png')
var skin_6_scar_left = require('../assets/Customization/Skin_6/scar_left.png')
var skin_6_scar_right = require('../assets/Customization/Skin_6/scar_right.png')
var skin_7_scar_left = require('../assets/Customization/Skin_7/scar_left.png')
var skin_7_scar_right = require('../assets/Customization/Skin_7/scar_right.png')

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
                    <Image source={symptomDict[this.state.symptom]} style={{marginLeft:'20%', width: 50,height:50, right:0, 'alignSelf':'flex-end', 'zIndex':10000}} resizeMode="contain" />
                </Animated.View>
            </View>
        );
    }
}

class CustomPhoto extends React.Component {

    render() {

      photoDict = {}
      photoDict['skin'] = {
        0:skin_0,
        1:skin_1,
        2:skin_2,
        3:skin_3,
        4:skin_4,
        5:skin_5,
        6:skin_6,
        7:skin_7,
      }

      photoDict['nipple'] = {
        1: nipple_1,
        2: nipple_2,
        3: nipple_3,
        4: nipple_4,
        5: nipple_5,
        6: nipple_6,
      }

      photoDict['size'] = {
        0: {2:[skin_0_size_2_left,skin_0_size_2_right],3:[skin_0_size_3_left,skin_0_size_3_right],4:[skin_0_size_4_left,skin_0_size_4_right]},
        1: {2:[skin_1_size_2_left,skin_1_size_2_right],3:[skin_1_size_3_left,skin_1_size_3_right],4:[skin_1_size_4_left,skin_1_size_4_right]},
        2: {2:[skin_2_size_2_left,skin_2_size_2_right],3:[skin_2_size_3_left,skin_2_size_3_right],4:[skin_2_size_4_left,skin_2_size_4_right]},
        3: {2:[skin_3_size_2_left,skin_3_size_2_right],3:[skin_3_size_3_left,skin_3_size_3_right],4:[skin_3_size_4_left,skin_3_size_4_right]},
        4: {2:[skin_4_size_2_left,skin_4_size_2_right],3:[skin_4_size_3_left,skin_4_size_3_right],4:[skin_4_size_4_left,skin_4_size_4_right]},
        5: {2:[skin_5_size_2_left,skin_5_size_2_right],3:[skin_5_size_3_left,skin_5_size_3_right],4:[skin_5_size_4_left,skin_5_size_4_right]},
        6: {2:[skin_6_size_2_left,skin_6_size_2_right],3:[skin_6_size_3_left,skin_6_size_3_right],4:[skin_6_size_4_left,skin_6_size_4_right]},
        7: {2:[skin_7_size_2_left,skin_7_size_2_right],3:[skin_7_size_3_left,skin_7_size_3_right],4:[skin_7_size_4_left,skin_7_size_4_right]},
      }

      photoDict['masectomy'] = {
        0: [skin_0_scar_left,skin_0_scar_right],
        1: [skin_1_scar_left,skin_1_scar_right],
        2: [skin_2_scar_left,skin_2_scar_right],
        3: [skin_3_scar_left,skin_3_scar_right],
        4: [skin_4_scar_left,skin_4_scar_right],
        5: [skin_5_scar_left,skin_5_scar_right],
        6: [skin_6_scar_left,skin_6_scar_right],
        7: [skin_7_scar_left,skin_7_scar_right],
      }

      var nipples = [];

      if (this.props.masectomy != 1 && this.props.masectomy != 3) {
        nipples.push(<Image key={'nipple1'} source={photoDict['nipple'][this.props.nipple_color]} style={{margin:0, width: '5%','height':'5%', 'position':'absolute', top:'70%', left:'30%'}} />)
      }
      if (this.props.masectomy != 2 && this.props.masectomy != 3) {
        nipples.push(<Image key={'nipple2'} source={photoDict['nipple'][this.props.nipple_color]} style={{margin:0, width: '5%','height':'5%', 'position':'absolute', top:'70%', right:'30%'}} />)
      }

      var size = [];
      if (this.props.size > 1) {
        var right_source = photoDict['size'][this.props.skin_color][this.props.size][1]
        var left_source = photoDict['size'][this.props.skin_color][this.props.size][0]
        var height = photoDict['size'][this.props.skin_color][this.props.size][2]
        var width = photoDict['size'][this.props.skin_color][this.props.size][3]
        console.log("Height/Width", height, width)

        if (this.props.masectomy != 1 && this.props.masectomy != 3) {
          size.push(<Image key={'breast1'} source={left_source} style={{margin:0, height: '31%', width:'28%', 'position':'absolute', top:'53%', left:'21%'}} />)
        }
        else {
          size.push(<Image key={'breast1'} source={photoDict['masectomy'][this.props.skin_color][0]} style={{margin:0, height: '18%', width:'22%', 'position':'absolute', top:'65%', left:'25%'}} />)
        }

        if (this.props.masectomy != 2 && this.props.masectomy != 3) {
          size.push(<Image key={'breast2'} source={right_source} style={{margin:0, height: '31%', width:'28%','position':'absolute', top:'53%', right:'21%'}} />)
        }
        else {
          size.push(<Image key={'breast2'} source={photoDict['masectomy'][this.props.skin_color][1]} style={{margin:0, height: '18%', width:'22%', 'position':'absolute', top:'65%', right:'25%'}} />)
        }

      }

      /*
      var draggable_symptoms = [];
      console.log("Symptom Details", this.props.symptom_details)
      if (this.props.symptom_details) {
        for (index in this.props.symptom_details) {
          var symptom = this.props.symptom_details[index];
          console.log("Draggable Symptom In For Loop", symptom, symptom['symptom'])
          draggable_symptoms.push(<Draggable x_coord={symptom['x_coord']} y_coord={symptom['y_coord']} name={index} setSymptomCoords={this.props.setSymptomCoords} symptom={symptom['symptom']} />)
        }
      }
      */

      var skin = photoDict['skin'][0]
      if (this.props.skin_color) {
          skin = photoDict['skin'][this.props.skin_color]
      }

      return (<View style={{'width':'80%', backgroundColor:'white', borderRadius:25, height: 300, alignItems:'center',justifyContent:'center', marginTop:20, zIndex:10}} resizeMode={"contain"}>
        <Image source={skin} style={{margin:0, width: '100%','height':'100%', 'position':'absolute', top:10}} />
        {nipples}
        {size}
        <Text style={{'position':'absolute', fontSize:20, left:-10, top:'80%', backgroundColor:'#a657a1', height:30, width:30, borderRadius:15, color:'white', textAlign:'center', borderColor:'white', borderWidth:1}}>L</Text>
        <Text style={{'position':'absolute', fontSize:20, right:-10, top:'80%', backgroundColor:'#a657a1', height:30, width:30, borderRadius:15, color:'white', textAlign:'center', borderColor:'white', borderWidth:1}}>R</Text>
        </View>)
    }
}

export default CustomPhoto;
