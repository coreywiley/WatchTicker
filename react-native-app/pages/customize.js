import React from 'react';
import { StyleSheet, View, ScrollView, AsyncStorage, Image, TouchableWithoutFeedback} from 'react-native';
import ajaxWrapper from '../base/ajax.js';
import { Form, Container, Header, Title, Content, FooterTab, Left, Right, Body, Card, CheckBox, CardItem, List, ListItem, InputGroup, Input, Spinner, Item, Label, Textarea} from 'native-base';
import ButtonSelect from '../library/buttonSelect.js';
import {LinearGradient} from 'expo';
import Button from '../localLibrary/button.js';
import Footer from '../localLibrary/footer.js';
import Text from '../library/text.js';
import CustomPhoto from '../localLibrary/customPhoto.js';
import SelectionBox from '../localLibrary/selectionBox.js';

var skin_color_1_selected = require('../assets/Customization/skin_color_1_selected.png')
var skin_color_2_selected = require('../assets/Customization/skin_color_2_selected.png')
var skin_color_3_selected = require('../assets/Customization/skin_color_3_selected.png')
var skin_color_4_selected = require('../assets/Customization/skin_color_4_selected.png')
var skin_color_5_selected = require('../assets/Customization/skin_color_5_selected.png')
var skin_color_6_selected = require('../assets/Customization/skin_color_6_selected.png')
var skin_color_7_selected = require('../assets/Customization/skin_color_7_selected.png')

var skin_color_1 = require('../assets/Customization/skin_color_1.png')
var skin_color_2 = require('../assets/Customization/skin_color_2.png')
var skin_color_3 = require('../assets/Customization/skin_color_3.png')
var skin_color_4 = require('../assets/Customization/skin_color_4.png')
var skin_color_5 = require('../assets/Customization/skin_color_5.png')
var skin_color_6 = require('../assets/Customization/skin_color_6.png')
var skin_color_7 = require('../assets/Customization/skin_color_7.png')

var nipple_1_selected = require('../assets/Customization/nipple_1_selected.png')
var nipple_2_selected = require('../assets/Customization/nipple_2_selected.png')
var nipple_3_selected = require('../assets/Customization/nipple_3_selected.png')
var nipple_4_selected = require('../assets/Customization/nipple_4_selected.png')
var nipple_5_selected = require('../assets/Customization/nipple_5_selected.png')
var nipple_6_selected = require('../assets/Customization/nipple_6_selected.png')

var nipple_1 = require('../assets/Customization/nipple_1.png')
var nipple_2 = require('../assets/Customization/nipple_2.png')
var nipple_3 = require('../assets/Customization/nipple_3.png')
var nipple_4 = require('../assets/Customization/nipple_4.png')
var nipple_5 = require('../assets/Customization/nipple_5.png')
var nipple_6 = require('../assets/Customization/nipple_6.png')

var size_1_selected = require('../assets/Customization/size_selected_1.png')
var size_2_selected = require('../assets/Customization/size_selected_2.png')
var size_3_selected = require('../assets/Customization/size_selected_3.png')
var size_4_selected = require('../assets/Customization/size_selected_4.png')

var size_1 = require('../assets/Customization/size_1.png')
var size_2 = require('../assets/Customization/size_2.png')
var size_3 = require('../assets/Customization/size_3.png')
var size_4 = require('../assets/Customization/size_4.png')

var masectomy_1_selected = require('../assets/Customization/mass_selected_1.png')
var masectomy_2_selected = require('../assets/Customization/mass_selected_2.png')
var masectomy_3_selected = require('../assets/Customization/mass_selected_3.png')

var masectomy_1 = require('../assets/Customization/mass_1.png')
var masectomy_2 = require('../assets/Customization/mass_2.png')
var masectomy_3 = require('../assets/Customization/mass_3.png')

class Customize extends React.Component {
  constructor(props) {
      super(props);

      this.state = {'skin_color' : 0, 'size' : 0, 'nipple_color':0, 'masectomy': 0, 'id':null, loaded:false};
      this.objectCallback = this.objectCallback.bind(this);
      this.handleChange = this.handleChange.bind(this);
      this.save = this.save.bind(this);
      this.reset = this.reset.bind(this);
  }

    componentDidMount(value) {
        ajaxWrapper('GET','/api/home/customize/?user=' + this.props.userId, {}, this.objectCallback);
    }


    handleChange(name,value) {
        var newState = {};
        newState[name] = value;

        this.setState(newState);
    }

    objectCallback(result) {
      if (result.length > 0) {
        var newState = result[0]['customize'];
      }
      else {
        var newState = {}
      }

      newState['loaded'] = true;
      console.log("Object Callback", newState)
      this.setState(newState)
    }

    save() {
      var submitUrl = '/api/home/customize/';
      if (this.state.id != null) {
        submitUrl += this.state.id
      }
      var data = this.state;
      data['user'] = this.props.userId;
      console.log("Data",data)
      ajaxWrapper('POST',submitUrl, data, () => this.props.setGlobalState('page','journal'))
    }

    reset() {
      this.setState({'skin_color' : 0, 'size' : 0, 'nipple_color':0, 'masectomy': 0})
    }

    render() {


        if (this.state.loaded) {

          var skin_color_options = [
            {'source':skin_color_1,'selected_source':skin_color_1_selected,'value':'1'},
            {'source':skin_color_2,'selected_source':skin_color_2_selected,'value':'2'},
            {'source':skin_color_3,'selected_source':skin_color_3_selected,'value':'3'},
            {'source':skin_color_4,'selected_source':skin_color_4_selected,'value':'4'},
            {'source':skin_color_5,'selected_source':skin_color_5_selected,'value':'5'},
            {'source':skin_color_6,'selected_source':skin_color_6_selected,'value':'6'},
            {'source':skin_color_7,'selected_source':skin_color_7_selected,'value':'7'}]

            var size_options = [
              {'source':size_1,'selected_source':size_1_selected,'value':'1'},
              {'source':size_2,'selected_source':size_2_selected,'value':'2'},
              {'source':size_3,'selected_source':size_3_selected,'value':'3'},
              {'source':size_4,'selected_source':size_4_selected,'value':'4'}]

          var nipple_color_options = [
            {'source':nipple_1,'selected_source':nipple_1_selected,'value':'1'},
            {'source':nipple_2,'selected_source':nipple_2_selected,'value':'2'},
            {'source':nipple_3,'selected_source':nipple_3_selected,'value':'3'},
            {'source':nipple_4,'selected_source':nipple_4_selected,'value':'4'},
            {'source':nipple_5,'selected_source':nipple_5_selected,'value':'5'},
            {'source':nipple_6,'selected_source':nipple_6_selected,'value':'6'}]

          var masectomy_options = [
            {'source':masectomy_1,'selected_source':masectomy_1_selected,'value':'1'},
            {'source':masectomy_2,'selected_source':masectomy_2_selected,'value':'2'},
            {'source':masectomy_3,'selected_source':masectomy_3_selected,'value':'3'}]

          //<Image source={require('../assets/home.png')} style={{height: 200, width: 200, flex: 1}}/>
          return (
              <ScrollView>

              <LinearGradient
                colors={['#bd83b9', '#7d5d9b']}
                style={{alignItems: 'center', 'height':'100%', 'width':'100%'}}>

                  <Text style={{'color':'white', marginTop: 20}}>c    u    s    t    o    m    i    z    e</Text>

                  <CustomPhoto {...this.state} />

                  <SelectionBox title={'Skin Color'} answer={this.state.skin_color} handleChange={this.handleChange} name={'skin_color'} size={[30,30]} selected_size={[38,38]} options={skin_color_options} />
                  <SelectionBox title={'Size'} answer={this.state.size} handleChange={this.handleChange} name={'size'} options={size_options} />
                  <SelectionBox title={'Nipple Color'} answer={this.state.nipple_color} handleChange={this.handleChange} name={'nipple_color'} size={[35,35]} selected_size={[43,43]} options={nipple_color_options} />

                  <View style={{'width':'80%', marginTop:20, height:20, alignItems:'center', 'justifyContent':'center'}}>
                    <View style={{'borderTopWidth':2, borderColor:'white', 'width':'100%'}}>
                    </View>

                    <Text style={{fontFamily: 'Quicksand', color:'white', position:'absolute', paddingRight:20, paddingLeft:20, backgroundColor:'#8e67a3', 'textAlign':'center', zIndex:1000}}>Optional</Text>
                  </View>

                  <SelectionBox title={'Massectomy'} optional={true} answer={this.state.masectomy} handleChange={this.handleChange} name={'masectomy'} options={masectomy_options} />

                  <Button onPress={() => this.save()} text={'Save'} selected={true}></Button>

                  <TouchableWithoutFeedback onPress={() => this.reset()}>
                    <Text style={{'color':'white', borderBottomWidth:1, borderColor:'white'}}>Reset Default</Text>
                  </TouchableWithoutFeedback>
                  <View style={{'height':80}}>
                  </View>

                  </LinearGradient>
              </ScrollView>
          );
        }
        else {
          return (
            <View>
                  <Text>Welcome To Customization</Text>
              </View>
          );
        }

    }
}

export default Customize;
