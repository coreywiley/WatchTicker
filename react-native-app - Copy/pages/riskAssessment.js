import React from 'react';
import { StyleSheet, View, TouchableWithoutFeedback } from 'react-native';
import ajaxWrapper from '../base/ajax.js';
import { Toast, Container, Header, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Card, CheckBox, CardItem, List, ListItem, InputGroup, Input, Spinner } from 'native-base';
import Text from '../library/text.js';

class Edit extends React.Component {
  constructor(props) {
    super(props);
    this.chooseQuestion = this.chooseQuestion.bind(this);
  }

  chooseQuestion() {
    this.props.setGlobalState('onboardingIndex',this.props.index)
    this.props.setGlobalState('page','onboarding')
  }

  render() {
    return(
      <TouchableWithoutFeedback style={{width:'15%'}} onPress={() => this.chooseQuestion()}>
        <Text style={{'color':'#53c0a7'}}>Edit</Text>
      </TouchableWithoutFeedback>
    )

  }
}

class RiskAssessment extends React.Component {
  constructor(props) {
        super(props);
        this.state = {
          questions: [],
          loaded:false,
        };

        this.questionCallback = this.questionCallback.bind(this);
        this.chooseQuestion = this.chooseQuestion.bind(this);

      }

    componentDidMount() {
      console.log("Running Ajax")
      ajaxWrapper('GET','/api/home/question/?archived=false&order_by=order', {}, this.questionCallback)
    }

    questionCallback(result) {
      var questions = [];
      for (var index in result) {
        var question = result[index]['question'];
        questions.push(question)
      }

      this.setState({questions:questions, loaded:true})
    }

    chooseQuestion(index) {
      console.log("Choose Question", index)
      this.props.setGlobalState('onboardingIndex':index)
      this.props.setGlobalState('page','onboarding')
    }

    render() {

      if (this.state.loaded == false) {
        return (
          <View style={styles.container}>
            <Text>Loading...</Text>
          </View>
        );
      }
      else {

      questions = [];

      for (var index in this.state.questions) {
        var question = this.state.questions[index]

        questions.push(<View style={{padding:20, borderBottomWidth:2, borderColor:'#aaa', flexDirection:'row', justifyContent:'center', alignItems:'center'}}>
          <Text style={{'color':'#ad59a3', marginBottom:20, width: '85%', padding:10}}>{question.name}</Text>

          <Edit setGlobalState={this.props.setGlobalState} index={index} />
        </View>)

      }

      return (
        <Content>
        {questions}
        </Content>
        )
    }
  }
}

export default RiskAssessment;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
