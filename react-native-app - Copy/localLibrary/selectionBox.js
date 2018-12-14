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

class ImageSelect extends React.Component {
  render() {
    var option = this.props.option;
    if (this.props.name == 'size' || this.props.name == 'masectomy') {
      if (this.props.name == 'masectomy' && option['value'] == '3') {
        return (
          <TouchableWithoutFeedback onPress={() => this.props.handleChange(this.props.name, option['value'])}><Image source={option['source']} style={{margin:0, borderRadius: 15, width: '100%', height: 100}}/></TouchableWithoutFeedback>
        )
      }
      else {
        return (
          <TouchableWithoutFeedback onPress={() => this.props.handleChange(this.props.name, option['value'])}><Image source={option['source']} style={{margin:0, borderRadius: 15, width: '50%', height: 100}}/></TouchableWithoutFeedback>
        )
      }
      return (
        <TouchableWithoutFeedback onPress={() => this.props.handleChange(this.props.name, option['value'])}><Image source={option['source']} style={{margin:0, borderRadius: 15, width: '50%', height: 100}}/></TouchableWithoutFeedback>
      )
    }
    else {
      console.log("Name", this.props.name);
      if (this.props.name == 'symptoms') {
        return (
          <TouchableWithoutFeedback onPress={() => this.props.handleChange(this.props.name, option['value'], true)}><Image source={option['source']} style={{margin:4, borderRadius: 15, width: '30%', height: 100}}/></TouchableWithoutFeedback>
        )
      }
      else {
        return (
          <TouchableWithoutFeedback onPress={() => this.props.handleChange(this.props.name, option['value'])}><Image source={option['source']} style={{margin:4, borderRadius: 15, width: this.props.size[0], height: this.props.size[1]}}/></TouchableWithoutFeedback>
        )
      }
    }

  }

}

class SelectionBox extends React.Component {
  constructor(props) {
    super(props);

    if (this.props.optional) {
      this.state = {'display':false}
    }
    else {
      this.state = {'display':true}
    }

    this.show = this.show.bind(this);

  }

  show() {
    this.setState({'display':!this.state.display})
  }

  render() {

    if (this.state.display == false) {
      return (
        <View style={{'width':'80%'}} >
        <Button onPress={() => this.show()} text={this.props.title} width={'95%'} />
        </View>
      )
    }
    else {
      var options = [];
      for (var index in this.props.options) {
        var option = this.props.options[index];
        if (this.props.answer == option['value'] || (this.props.multi && this.props.answer.indexOf(option['value']) > -1)) {
          if (this.props.name == 'size' || this.props.name == 'masectomy') {
            if (this.props.name == 'masectomy' && this.props.answer == 3) {
              options.push(<Image source={option['selected_source']} style={{margin:0, width: '100%', height: 100}}/>)
            }
            else {
              options.push(<Image source={option['selected_source']} style={{margin:0, width: '50%', height: 100}}/>)
            }

          }
          else {
            options.push(<Image source={option['selected_source']} style={{margin:0, width: this.props.selected_size[0], height: this.props.selected_size[1]}}/>)
          }
        }
        else if (this.props.name == 'symptom' && this.props.answer.indexOf(option['value'])) {
          options.push(<Image source={option['selected_source']} style={{margin:0, width: '33%', height: 100}} />)
        }
        else {
          if (this.props.name == 'size' || this.props.name == 'masectomy') {
            options.push(<ImageSelect name={this.props.name} handleChange={this.props.handleChange} option={option} style={{margin:0, width: '50%', height: 100}}/>)
          }
          else if (this.props.name == 'symptom') {
            options.push(<ImageSelect name={this.props.name} size={['33%',100]} handleChange={this.props.handleChange} option={option} style={{margin:0, width: '33%', height: 100}}/>)
          }
          else {
            var size = ['30%',100];
            if (this.props.size) {
              size = this.props.size
            }
            options.push(<ImageSelect size={size} name={this.props.name} handleChange={this.props.handleChange} option={option} />)
          }
        }
      }

      var colors = ['#ddd', '#fff', '#fff'];
      if (this.props.name == 'size' || this.props.name == 'masectomy') {
        colors = [ '#ddd', '#ad92b9']
      }

      var title = <Text style={{'color':'#a657a1', textAlign:'center', 'width':'100%'}}>{this.props.title}</Text>
      if (this.props.optional) {
        var title = <TouchableWithoutFeedback onPress={this.show} style={{'width':'100%'}}><Text style={{'color':'#a657a1', textAlign:'center', 'width':'100%'}}>{this.props.title}</Text></TouchableWithoutFeedback>
      }

      return (
        <View style={{'width':'100%', alignItems:'center', justifyContent:'center', marginTop:20}}>
          <View style={{'backgroundColor': 'white', 'width':'80%', 'padding':10, borderTopLeftRadius: 25, borderTopRightRadius: 25}} >
          {title}
          </View>
          <LinearGradient colors={colors} style={{'backgroundColor': 'white', 'width':'80%', 'padding':20,  alignItems:'center', justifyContent:'center', borderBottomLeftRadius: 25, borderBottomRightRadius: 25, flexDirection: 'row', flexWrap: 'wrap'}}>
            {options}
          </LinearGradient>

        </View>

      )
    }
  }
}

export default SelectionBox;
