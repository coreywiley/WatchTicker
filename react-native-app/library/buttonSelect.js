import React from 'react';
import { StyleSheet, View, AsyncStorage } from 'react-native';
import ajaxWrapper from '../base/ajax.js';
import { Form, Container, Header, Title, Content, Footer, FooterTab, Left, Right, Body, Text, Card, CheckBox, CardItem, List, ListItem, InputGroup, Input, Spinner, Item, Label, Textarea} from 'native-base';
import DateTimePicker from '../library/DateTimePicker.js';
import Button from '../localLibrary/button.js';

class ButtonSelect extends React.Component {
  constructor(props) {
      super(props);

      this.state = {'text':''}
      this.handlePress = this.handlePress.bind(this);
      this.handleOther = this.handleOther.bind(this);
      this.changeOtherText = this.changeOtherText.bind(this);

  }

  handlePress() {
    if (this.props.multi) {
      this.props.handleChange(this.props.name, this.props.value, true)
    }
    else {
      this.props.handleChange(this.props.name, this.props.value)
    }
  }

  handleOther() {
    if (this.props.multi) {
      this.props.handleChange(this.props.name, this.state.text, true)
    }
    else {
      this.props.handleChange(this.props.name, this.state.text)
    }
  }

  changeOtherText(text) {
    this.setState({'text':text})
  }

  render() {

    if (this.props.value == "Other (Date)") {
      return (<DateTimePicker answer={this.props.answer} handleChange={this.props.handleChange} date={true} />)
    }
    else if (this.props.value == "Other (Specify)") {
      if (this.props.multi) {
        if (this.props.answer != '' && this.state.text != '' && this.props.answer.indexOf(this.state.text) > -1) {
          return (<Button success={true} full>
            <Text onPress={this.handleOther}>Other (Specify)</Text>
            <Text>{this.state.text}</Text>
            <Input onChangeText={(text) => this.changeOtherText(text)} value={this.state.text} />
          </Button>)
        }
        else {
          return (<Button danger={true} full>
            <Text onPress={this.handleOther}>Other (Specify)</Text>
            <Text>{this.state.text}</Text>
            <Input onChangeText={(text) => this.changeOtherText(text)} value={this.state.text} />
          </Button>)
        }
      }
      else {
        if (this.props.answer == this.state.text) {
          return (<Button success={true} full>
            <Text onPress={this.handlePress}>Other (Specify)</Text>
            <Text>{this.state.text}</Text>
            <Input onChangeText={(text) => this.changeOtherText(text)} value={this.state.text} />
          </Button>)
        }
        else {
          return (<Button danger={true} full>
            <Text onPress={this.handlePress}>Other (Specify)</Text>
            <Text>{this.state.text}</Text>
            <Input onChangeText={(text) => this.changeOtherText(text)} value={this.state.text} />
          </Button>)
        }
      }

    }
    else if (this.props.multi && this.props.answer != '' && this.props.answer.indexOf(this.props.value) > -1) {
      return (<Button selected={true} onPress={this.handlePress} text={this.props.value}>
      </Button>)
    }
    else if (!this.props.multi && this.props.answer == this.props.value) {
      return (<Button selected={true} onPress={this.handlePress}  text={this.props.value}>
      </Button>)
    }
    else {
      return (<Button onPress={this.handlePress}  text={this.props.value}>
      </Button>)
    }
  }
}

export default ButtonSelect;
