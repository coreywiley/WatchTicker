import React from 'react';
import { TouchableWithoutFeedback, Image,StyleSheet, View, AsyncStorage, ScrollView } from 'react-native';
import ajaxWrapper from '../base/ajax.js';
import { Form, Container, Header, Title, Content,Left, Right, Body, Card, CheckBox, CardItem, List, ListItem, InputGroup, Input, Spinner, Item, Label, Textarea} from 'native-base';
import DateTimePicker from '../library/DateTimePicker.js';
import ButtonSelect from '../library/buttonSelect.js';
import {LinearGradient} from 'expo';
import Button from '../localLibrary/button.js';
import Footer from '../localLibrary/footer.js';
import Text from '../library/text.js';
import Loading from '../library/loading.js';

var close = require('../assets/settings/close.png')

class Factoid extends React.Component {
  render() {
    return (
      <View style={{'alignItems':'center', justifyContent:'center'}}>
      <View style={{'marginTop':150, 'alignItems':'center', justifyContent:'center'}}>
        <View style={{backgroundColor:'white', 'alignItems':'center', justifyContent:'center', 'width':'80%', borderRadius:25, padding:20, paddingBottom: 40, elevation: 5}}>
          <Text style={{'color':'purple', lineHeight:30, textAlign:'center'}}>{this.props.factoid}</Text>
        </View>

      </View>
      <TouchableWithoutFeedback onPress={this.props.close} style={{position:'absolute', bottom:-50, 'alignItems':'center', justifyContent:'center',height:75, width:75, borderRadius:50, backgroundColor: 'white', zIndex:99999, elevation: 5}}>
        <View style={{position:'absolute', bottom:-50, 'alignItems':'center', justifyContent:'center',height:75, width:75, borderRadius:50, backgroundColor: 'white', zIndex:99999, elevation: 5}}>
          <Image source={close} style={{width: 50,height:50, zIndex:99999}} resizeMode="contain" />
        </View>
      </TouchableWithoutFeedback>
      </View>
    )
  }
}

class Onboarding extends React.Component {
  constructor(props) {
      super(props);

      var onboardingIndex = 0;
      console.log("Before", this.props.onboardingIndex)
      if (this.props.onboardingIndex > -1) {
        onboardingIndex = parseInt(this.props.onboardingIndex);
      }
      console.log("After", onboardingIndex)
      this.state = {'questions' : [], 'currentQuestion' : onboardingIndex, loaded:false, 'answers':{}, 'info':false, home:false, welcome_screen:1};
      this.objectCallback = this.objectCallback.bind(this);
      this.next = this.next.bind(this);
      this.prev = this.prev.bind(this);
      this.home = this.home.bind(this);
      this.handleChange = this.handleChange.bind(this);
      this.answersCallback = this.answersCallback.bind(this);
      this.answerCallback = this.answerCallback.bind(this);
      this.info = this.info.bind(this);
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

      if (this.props.onboardingIndex != -1) {

      }
      else if (this.state.currentQuestion == this.state.questions.length - 1) {
        this.setGlobalState('page','customize')
      }
      else {

        var nextQuestion = this.state.questions[this.state.currentQuestion + 1]
        console.log("Answer Lookup", this.state.currentQuestion, this.state.currentQuestion + 1, nextQuestion, this.state.answers)
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

      if (this.props.onboardingIndex != -1) {
        this.props.setGlobalState('page','riskAssessment')
      }

      if (this.state.currentQuestion != 0) {
        var currentAnswer = this.state.answers[this.state.questions[this.state.currentQuestion - 1].id.toString()]

        if (currentAnswer) {
          currentAnswer = currentAnswer.answer;
        }
        else {
          currentAnswer = '';
        }

        this.setState({'currentQuestion': this.state.currentQuestion - 1, 'answer':currentAnswer})
      }
    }

    home() {
      this.setState({home: true, info: false})
    }

    info() {
      this.setState({'info':!this.state.info})
    }

    answerCallback(result) {
      if (this.props.onboardingIndex != -1) {
        this.props.setGlobalState('page','riskAssessment')
      }

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
              pickerItems.push(<ButtonSelect answer={this.state.answer} handleChange={this.handleChange} name={'answer'} value={value}/>)
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
              pickerItems.push(<ButtonSelect multi={true} answer={this.state.answer} handleChange={this.handleChange} name={'answer'} value={value}/>)

            }

            var item = <View>
                {pickerItems}
                  </View>;
          }
          else if (question.component == 'DateTimePicker') {
            var props = JSON.parse(question.props);
            props['name'] = 'answer';
            var pickerItems = [];

            var item = <DateTimePicker name={'answer'} answer={this.state.answer} handleChange={this.handleChange} date={true} />;

            }

          var next = null;

          if (this.state.answer != '' || this.state.answer != []) {
            var next = <Button onPress={() => this.next()} text={'Submit'} selected={true}>
            </Button>;
          }
          else if (this.state.currentQuestion == this.state.questions.length - 1) {
            next = <Button onPress={() => this.next()} text={'Complete On-Boarding'}  selected={true}>
            </Button>;
          }


          if (this.state.info == false) {
            var colors = ['#bd83b9', '#7d5d9b'];
          }
          else {
            var colors = ['#52bfa6', '#3e8797'];
          }

          var circles = [];
          for (var i = 0; i < this.state.questions.length; i++) {
            var color = '#a657a1';
            if (i > this.state.currentQuestion) {
              color = '#d6afd2';
            }
            circles.push(<View style={{'backgroundColor':color, height: 6, width:6, borderRadius:3, margin:3}}></View>)
          }


          var content = [];

          var footer = <Footer prev={this.prev} home={this.home} info={this.info}/>
          if (this.state.home) {
            content.push(<Text style={{marginTop:'25%', marginBottom:30, lineHeight:30, color:'#fff', width:'60%', textAlign:'center'}}>Are you sure you want to skip the personalization process? Your progress will be saved and you may complete the questions at any time.</Text>)
            content.push(<Button text={"No, Let's Continue"} onPress={() => this.setState({home:false})} />)
            content.push(<Button text={"Yes, I'll Finish Later"} onPress={() => this.props.setGlobalState('page','customize')} />)
          }
          else if (this.state.welcome_screen == 1) {
            content.push(<Text style={{marginTop:'25%', fontSize:40, color:'#fff', width:'60%', textAlign:'center'}}>Welcome!</Text>)
            content.push(<Text style={{marginBottom:'30%', lineHeight:30, color:'#fff', width:'80%', textAlign:'center'}}>We would like to ask you a few questions to personalize your experience. This should take 5 minutes or less and only needs to be completed once.</Text>)
            content.push(<Button text={"Let's Get Started!"} onPress={() => this.setState({welcome_screen:2})} />)
            content.push(<TouchableWithoutFeedback onPress={() => this.setState({home:true})}><Text style={{marginTop:30, color:'#fff', paddingBottom:2, borderColor:'#fff', borderBottomWidth:1}}>I'll Do It Later</Text></TouchableWithoutFeedback>)

            footer = null;
          }
          else if (this.state.welcome_screen == 2) {

            var pop_up = <View style={{'marginTop':150, 'alignItems':'center', justifyContent:'center'}}>
              <View style={{backgroundColor:'white', 'alignItems':'center', justifyContent:'center', 'width':'60%', borderRadius:25, padding:20, paddingBottom: 40, elevation: 5}}>
                <Text style={{'color':'purple', lineHeight:30, textAlign:'center', marginBottom:30}}>We know these questions are personal so click on the question mark icon to learn why we ask each one.</Text>
                <Button text={"Got it!"} selected={true} onPress={() => this.setState({welcome_screen: 3})} />
              </View>
            </View>;
            content.push(pop_up)
            colors = ['#52bfa6', '#3e8797'];
            footer = <Footer prev={null} home={null} info={null} backgroundColor={'#a8cbd1'}/>
          }
          else if (this.state.info) {
              var question = this.state.questions[this.state.currentQuestion];
            content.push(<Factoid close={this.info} factoid={question.factoid} />)

          }
          else {
            content.push(<View style={{'flexDirection':'row', 'flexWrap':'wrap','alignItems':'flex-start', 'marginTop':40, marginBottom:60}}>
            {circles}
            </View>)
            content.push(<Text style={{color:'white', textAlign:'center', padding:10}}>{this.state.questions[this.state.currentQuestion]['name']}</Text>)
            content.push(item);
            content.push(next);
            content.push(<View style={{'marginBottom':200}} />)

          }


          return (
            <View>
            <LinearGradient
              colors={colors}
              style={{alignItems: 'center', 'height':'100%', 'width':'100%'}}>

              <ScrollView style={{'height':'100%','width':'100%'}}>
              <View style={{alignItems:'center', justifyContent:'center'}}>
                {content}
                </View>
              </ScrollView>
              {footer}
              </LinearGradient>
              </View>
          );
        }
        else {
          return (
            <Loading />
          );
        }

    }
}

export default Onboarding;
