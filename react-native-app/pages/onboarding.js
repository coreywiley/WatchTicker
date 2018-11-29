import React from 'react';
import { StyleSheet, View, AsyncStorage } from 'react-native';
import ajaxWrapper from '../base/ajax.js';
import { Form, Container, Header, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Text, Card, CheckBox, CardItem, List, ListItem, InputGroup, Input, Spinner, Item, Label, Textarea} from 'native-base';
import ScrollView from '../library/scrollview.js';
import ButtonSelect from '../library/buttonSelect.js';

class Onboarding extends React.Component {
  constructor(props) {
      super(props);

      this.state = {'questions' : [], 'currentQuestion' : 0, loaded:false, 'answers':{}};
      this.objectCallback = this.objectCallback.bind(this);
      this.next = this.next.bind(this);
      this.prev = this.prev.bind(this);
      this.handleChange = this.handleChange.bind(this);
      this.answersCallback = this.answersCallback.bind(this);
      this.answerCallback = this.answerCallback.bind(this);
  }

    componentDidMount(value) {
        ajaxWrapper('GET','/api/home/question/?order_by=preview_order&preview_archived=false', {}, this.objectCallback);

    }

    answersCallback(result) {
        var answers = {};

        for (var index in result) {
          var answer = result[index]['answer'];
          answers[answer.question_id.toString()] = answer;
        }

        var currentAnswer = answers[this.state.questions[this.state.currentQuestion].id].answer

        if (currentAnswer) {
          this.setState({'answers':answers, 'answer':currentAnswer})
        }
        else {
          this.setState({'answers':answers, 'answer':''})
        }
    }

    handleChange(name,value, multi=false) {
        var newState = {};
        console.log("Handle Change",name,value,multi)
        if (multi) {
          console.log("Multi", value)
          if (this.state.answer == '') {
            var newValue = [];
          }
          else {
            if (typeof(this.state.answer) == 'string') {
              var newValue = JSON.parse(this.state.answer)
            }
            else {
              var newValue = this.state.answer;
            }
          }
          console.log("New Value", newValue)
          var index = newValue.indexOf(value)
          if (index == -1) {
            newValue.push(value);
          }
          else {
            newValue.splice(index,1)
          }

          newState[name] = newValue;
        }
        else {
          newState[name] = value;
        }

        console.log("New State", newState)
        var newCompleteState = this.state;
        newCompleteState[name] = value;
        this.setState(newState);
    }

    objectCallback(result) {
      var newState = {};
      var questions = [];
      for (var index in result) {
        var question = result[index]['question'];
        question['question'] = question['id']
        questions.push(question)
      }
      newState['loaded'] = true;
      newState['questions'] = questions;

      this.setState(newState, () => ajaxWrapper('GET','/api/home/answer/?user=' + this.props.userId, {}, this.answersCallback))
    }

    next() {
      console.log("Next")
      var question = this.state.questions[this.state.currentQuestion];
      var answer = this.state.answers[question.id.toString()]
      if (answer) {
        ajaxWrapper('POST','/api/home/answer/' + answer.id + '/', {answer:this.state.answer}, this.answerCallback)
      }
      else {
        ajaxWrapper('POST','/api/home/answer/', {'question':question.id, 'user': this.props.userId, 'answer':this.state.answer}, this.answerCallback)
      }


      if (this.state.currentQuestion == this.state.questions.length - 1) {
        this.setGlobalState('page','customize')
      }
      else {

        var nextQuestion = this.state.questions[this.state.currentQuestion + 1]
        console.log("Answer Lookup", nextQuestion, this.state.answers)
        var currentAnswer = this.state.answers[nextQuestion.id.toString()]
        console.log("Current Answer", currentAnswer)
        if (currentAnswer) {
          currentAnswer = currentAnswer.answer;
        }
        else {
          currentAnswer = '';
        }
        this.setState({'currentQuestion': this.state.currentQuestion + 1, 'answer':currentAnswer})
      }

    }

    prev() {

      var currentAnswer = this.state.answers[this.state.questions[this.state.currentQuestion - 1].id.toString()]

      if (currentAnswer) {
        currentAnswer = currentAnswer.answer;
      }
      else {
        currentAnswer = '';
      }

      this.setState({'currentQuestion': this.state.currentQuestion - 1, 'answer':currentAnswer})
    }

    answerCallback(result) {
      console.log("Answer Callback", result)
      var answer = result[0]['answer'];
      var answers = this.state.answers;
      answers[answer.question_id.toString()] = answer;
      this.setState({'answers':answers})
    }

    render() {
        if (this.state.loaded) {

          var question = this.state.questions[this.state.currentQuestion];
          var props = {};
          if (question.component == 'TextInput') {
            var props = JSON.parse(question.props);
            props['name'] = 'answer';
            var item = <Item><Input placeholder={props['placeholder']} onChangeText={(text) => this.handleChange(props['name'],text)} value={this.state.answer} /></Item>;
          }
          else if (question.component == 'TextArea') {
            var props = JSON.parse(question.props);
            props['name'] = 'answer';
            var item = <Item><Textarea style={{'width':'100%'}} placeholder={props['placeholder']} onChangeText={(text) => this.handleChange(props['name'],text)} value={this.state.answer} rowSpan={3} bordered /></Item>;
          }
          else if (question.component == 'Select') {
            var props = JSON.parse(question.props);
            props['name'] = 'answer';
            var pickerItems = [];
            for (var index in props['options']) {
              var value = props['options'][index]['value'];
              pickerItems.push(<Item><ButtonSelect answer={this.state.answer} handleChange={this.handleChange} name={'answer'} value={value}/></Item>)
            }

            var item = <View>
                      {pickerItems}
                    </View>;
          }
          else if (question.component == 'MultiSelect') {
            var props = JSON.parse(question.props);
            props['name'] = 'answer';
            var pickerItems = [];
            for (var index in props['options']) {
              var value = props['options'][index]['value'];
              pickerItems.push(<Item><ButtonSelect multi={true} answer={this.state.answer} handleChange={this.handleChange} name={'answer'} value={value}/></Item>)

            }

            var item = <View>
                {pickerItems}
                  </View>;
          }
          else if (question.component == 'DateTimePicker') {
            var props = JSON.parse(question.props);
            props['name'] = 'answer';
            var pickerItems = [];

            var item = <Item><ScrollView answer={this.state.answer} handleChange={this.handleChange} date={true} /></Item>;

            }

          var next = null;

          if (this.state.answer != '' || this.state.answer != []) {
            var next = <Button onPress={() => this.next()} full>
              <Text>Next Question</Text>
            </Button>;
          }
          else if (this.state.currentQuestion == this.state.questions.length - 1) {
            next = <Button onPress={() => this.next()} full>
              <Text>Complete On-Boarding</Text>
            </Button>;
          }

          var prev = null;
          if (this.state.currentQuestion != 0) {
            prev = <Button danger={true} onPress={() => this.prev()} full>
              <Text>Previous Question</Text>
            </Button>;
          }



          return (
              <View>
                <Form>
                  <Text>{this.state.questions[this.state.currentQuestion]['name']}</Text>
                  <InputGroup>
                        {item}
                  </InputGroup>
                  </Form>
                  {next}
                  {prev}
              </View>
          );
        }
        else {
          return (
            <View>
                  <Text>Welcome To On-Boarding</Text>
              </View>
          );
        }

    }
}

export default Onboarding;
