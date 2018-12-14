import React from 'react';
import { TouchableWithoutFeedback, Image,StyleSheet, View, AsyncStorage, ScrollView, TextInput } from 'react-native';
import ajaxWrapper from '../base/ajax.js';
import { Form, Container, Header, Title, Content,Left, Right, Body, Card, CheckBox, CardItem, List, ListItem, InputGroup, Input, Spinner, Item, Label, Textarea} from 'native-base';
import DateTimePicker from '../library/DateTimePicker.js';
import ButtonSelect from '../library/buttonSelect.js';
import {LinearGradient} from 'expo';
import Button from '../localLibrary/button.js';
import Footer from '../localLibrary/footer.js';
import Text from '../library/text.js';
import Loading from '../library/loading.js';
import SwipeInput from '../library/swipeInput.js';

var close = require('../assets/settings/close.png')

var country_list = ['Afghanistan','Albania','Algeria','Andorra','Angola','Antigua and Barbuda','Argentina','Armenia','Australia','Austria','Azerbaijan','Bahamas','Bahrain','Bangladesh','Barbados','Belarus','Belgium','Belize','Benin','Bhutan','Bolivia','Bosnia and Herzegovina','Botswana','Brazil','Brunei','Bulgaria','Burkina Faso','Burundi',"Côte d'Ivoire",'Cabo Verde','Cambodia','Cameroon','Canada','Central African Republic','Chad','Chile','China','Colombia','Comoros','Congo (Congo-Brazzaville)','Costa Rica','Croatia','Cuba','Cyprus','Czech Republic','Democratic Republic of the Congo','Denmark','Djibouti','Dominica','Dominican Republic','Ecuador','Egypt','El Salvador','Equatorial Guinea','Eritrea','Estonia','Ethiopia','Fiji','Finland','France','Gabon','Gambia','Georgia','Germany','Ghana','Greece','Grenada','Guatemala','Guinea','Guinea-Bissau','Guyana','Haiti','Holy See','Honduras','Hungary','Iceland','India','Indonesia','Iran','Iraq','Ireland','Israel','Italy','Jamaica','Japan','Jordan','Kazakhstan','Kenya','Kiribati','Kuwait','Kyrgyzstan','Laos','Latvia','Lebanon','Lesotho','Liberia','Libya','Liechtenstein','Lithuania','Luxembourg','Macedonia (FYROM)','Madagascar','Malawi','Malaysia','Maldives','Mali','Malta','Marshall Islands','Mauritania','Mauritius','Mexico','Micronesia','Moldova','Monaco','Mongolia','Montenegro','Morocco','Mozambique','Myanmar (formerly Burma)','Namibia','Nauru','Nepal','Netherlands','New Zealand','Nicaragua','Niger','Nigeria','North Korea','Norway','Oman','Pakistan','Palau','Palestine State','Panama','Papua New Guinea','Paraguay','Peru','Philippines','Poland','Portugal','Qatar','Romania','Russia','Rwanda','Saint Kitts and Nevis','Saint Lucia','Saint Vincent and the Grenadines','Samoa','San Marino','Sao Tome and Principe','Saudi Arabia','Senegal','Serbia','Seychelles','Sierra Leone','Singapore','Slovakia','Slovenia','Solomon Islands','Somalia','South Africa','South Korea','South Sudan','Spain','Sri Lanka','Sudan','Suriname','Swaziland','Sweden','Switzerland','Syria','Tajikistan','Tanzania','Thailand','Timor-Leste','Togo','Tonga','Trinidad and Tobago','Tunisia','Turkey','Turkmenistan','Tuvalu','Uganda','Ukraine','United Arab Emirates','United Kingdom','United States of America','Uruguay','Uzbekistan','Vanuatu','Venezuela','Viet Nam','Yemen','Zambia','Zimbabwe']



class Factoid extends React.Component {
  render() {
    return (
      <View style={{'alignItems':'center', justifyContent:'center', elevation:3}}>
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
      this.state = {'questions' : [], 'currentQuestion' : onboardingIndex, loaded:false, 'answers':{}, 'info':false, home:false, welcome_screen:5, reminder_time:'T08:00', reminder_day: 1, 'settings':{'country_of_origin':'United States of America', 'zip_code':''}};
      this.objectCallback = this.objectCallback.bind(this);
      this.next = this.next.bind(this);
      this.prev = this.prev.bind(this);
      this.home = this.home.bind(this);
      this.handleChange = this.handleChange.bind(this);
      this.answersCallback = this.answersCallback.bind(this);
      this.answerCallback = this.answerCallback.bind(this);
      this.info = this.info.bind(this);
      this.save_country = this.save_country.bind(this);
      this.settingsCallback = this.settingsCallback.bind(this);
      this.noMenstrualCycle = this.noMenstrualCycle.bind(this);
      this.setMenstrualCycle = this.setMenstrualCycle.bind(this);
      this.reminderDay = this.reminderDay.bind(this);
      this.setReminderTime = this.setReminderTime.bind(this);
  }

    noMenstrualCycle() {
      var newState = this.state.settings;
      newState['last_menstruation_day'] = undefined;
      this.setState({settings:newState})
    }

    setMenstrualCycle() {
      console.log("this.state.settings.last_menstruation_day", this.state.settings.last_menstruation_day)
      ajaxWrapper('POST','/api/home/usersettings/' + this.state.settings.id + '/', {'last_menstruation_day':this.state.settings.last_menstruation_day, 'breast_exam_reminders':true}, () => this.setState({'welcome_screen':7}))
    }

    reminderDay(num) {
      this.setState({'reminderDay':num, 'welcome_screen':7})
    }

    setReminderTime() {
      if (this.state.settings.last_menstruation_day == undefined) {
        var date = new Date();
        var dateString = (date.getYear() + 1900) + '-1-' + this.state.reminderDay + 'T' + this.state.reminder_time
        console.log("Datestring",dateString)
        ajaxWrapper('POST','/api/home/usersettings/' + this.state.settings.id + '/', {'last_menstruation_day':'', 'reminder_day':dateString, breast_exam_reminders: true}, () => this.props.setGlobalState('page','customize'))
      }
      else {
        var dateString = this.state.settings.last_menstruation_day.split('T')[0] + 'T' + this.state.reminder_time
        console.log("Datestring",dateString)
        ajaxWrapper('POST','/api/home/usersettings/' + this.state.settings.id + '/', {'last_menstruation_day':dateString, 'reminder_day':'', breast_exam_reminders: true}, () => this.props.setGlobalState('page','customize'))
      }
    }

    componentDidMount(value) {
        ajaxWrapper('GET','/api/home/question/?order_by=preview_order&preview_archived=false', {}, this.objectCallback);
        ajaxWrapper('GET','/api/home/usersettings/?user=' + this.props.userId,{},this.settingsCallback)
    }

    settingsCallback(result) {
      var usersettings = result[0]['usersettings'];
      if (usersettings['country_of_origin'] == '') {
        usersettings['country_of_origin'] = 'United States of America'
      }
      console.log("last_menstruation_day", usersettings['last_menstruation_day'])
      if (usersettings['last_menstruation_day'] == undefined) {
        var date = new Date();
        var months = ['January','February','March','April','May','June','July','August','September','October','November','December']
        usersettings['last_menstruation_day'] = (date.getYear() + 1900) + '-' + (date.getMonth() + 1) + '-' + date.getDate() + 'T8:00:00'
        console.log("last_menstruation_day", usersettings['last_menstruation_day'])
      }
      this.setState({'settings':usersettings})
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
          if (name == 'country_of_origin' || name == 'zip_code' || name == 'last_menstruation_day') {
            newState['settings'] = this.state.settings;
            newState['settings'][name] = value;
          }
          else {
            newState[name] = value;
          }
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
        this.setState({'welcome_screen':this.state.welcome_screen + 1})
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

      if (this.state.welcome_screen > 3) {
        if (this.state.welcome_screen == 5) {
          this.setState({'welcome_screen':this.state.welcome_screen - 2})
        }
        else {
          this.setState({'welcome_screen':this.state.welcome_screen - 1})
        }

      }
      else if (this.state.currentQuestion != 0) {

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

    save_country() {
      ajaxWrapper('POST','/api/home/usersettings/' + this.state.settings.id + '/', {'country_of_origin':this.state.settings.country_of_origin, 'zip_code':this.state.settings.zip_code}, () => this.setState({'welcome_screen':6}))
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
          else if (this.state.welcome_screen == 4) {
            content.push(<Text style={{'color':'#fff', marginTop:'20%', width:'80%', textAlign:'center'}}>The tough stuff is over, thanks for sticking with us! You can view or edit your answers in the "My Health" section of this app. Now only two more easy questions</Text>)
            content.push(<View style={{marginTop:40}}><Button text={"Let's do this..."} onPress={() => this.setState({'welcome_screen':5})}/></View>)
            footer = null;
          }
          else if (this.state.welcome_screen == 5) {
            if (this.state.info) {
              content.push(<Factoid close={this.info} factoid={"We are building a database of localized breast resources. Knowing where you live will help us provide you useful information such as free screening events."} />)
            }
            else {
              var value = this.state.settings.country_of_origin
              content.push(<Text style={{'color':'#fff', marginTop:'20%'}}>What country do you live in?</Text>)
              content.push(<View style={{backgroundColor:'#fff', width:'80%', marginTop:20, borderRadius:25, elevation:3, padding:20}}><SwipeInput center={true} options={country_list} value={value} name={'country_of_origin'} handleChange={this.handleChange} /></View>)

              if (this.state.settings.country_of_origin == 'United States of America') {
                content.push(<Text style={{'color':'#fff', marginTop:20}}>What is your zipcode?</Text>)
                content.push(
                  <View style={{borderBottomWidth:2, borderColor:'#fff', flexDirection:'row', width:'60%', paddingBottom:5, marginTop:10}}>
                    <TextInput
                        underlineColorAndroid='transparent'
                        keyboardType='numeric'
                        textAlign={'center'}
                        autoCapitalize="none"
                        style={{marginLeft:'20%', width:'60%', height:'100%', color:'#fff', fontFamily:'Quicksand', textAlign:'center'}}
                        autoCorrect={false}
                        onChangeText={(text) => this.handleChange('zip_code',text)}
                        value={this.state.settings.zip_code}
                    />
                  </View>
                )
                if (this.state.settings.zip_code.length > 4) {
                  content.push(<View style={{marginTop:40}}><Button text={'Next'} onPress={this.save_country}/></View>)
                }


              }
              else {
                content.push(<View style={{marginTop:40}}><Button text={'Next'} onPress={this.save_country}/></View>)
              }
            }
          }
          else if (this.state.welcome_screen == 6) {
            if (this.state.info) {
              content.push(<Factoid close={this.info} factoid={"The best time to perform a breast self-exam is usually the week after your period ends when hormone-related breast swelling is lowest."} />)
            }
            else if (this.state.settings.last_menstruation_day != undefined){
              content.push(<Text style={{'color':'#fff', marginTop:'20%', 'width':'80%', marginBottom:20, textAlign:'center'}}>When was the last day of your last menstrual cycle?</Text>)
              content.push(<DateTimePicker name={'last_menstruation_day'} answer={this.state.settings.last_menstruation_day} handleChange={this.handleChange} date={true} />)
              content.push(<View style={{'width':'80%', marginTop:20}}><Button width={'95%'} text={"I don't remember"} onPress={this.noMenstrualCycle} /></View>)
              content.push(<View style={{'width':'80%', marginTop:20}}><Button width={'95%'} text={"I don't have a menstrual cycle"} onPress={this.noMenstrualCycle} /></View>)
              content.push(<View style={{'width':'80%', marginTop:20}}><Button width={'95%'} selected={true} text={"Submit"} onPress={this.setMenstrualCycle} /></View>)
            }
            else if (this.state.settings.last_menstruation_day == undefined) {
              content.push(<Text style={{'color':'#fff', marginTop:'20%', 'width':'80%', marginBottom:20, textAlign:'center'}}>You indicated that you do not have a regular menstrual cycle or do not remember the last day of your cycle. Please select the best time of the month for us to remind you to do your self-exam. You can change this at any time in Settings.</Text>)
              content.push(<View style={{'width':'80%', marginTop:20}}><Button width={'95%'} text={"1st of the month"} onPress={() => this.reminderDay(1)}/></View>)
              content.push(<View style={{'width':'80%', marginTop:20}}><Button width={'95%'} text={"15th of the month"} onPress={() => this.reminderDay(15)}/></View>)
            }

          }
          else if (this.state.welcome_screen == 7) {
            if (this.state.info) {
              content.push(<Factoid close={this.info} factoid={"The best time to perform a breast self-exam is usually the week after your period ends when hormone-related breast swelling is lowest."} />)
            }
            else {
              content.push(<Text style={{'color':'#fff', marginTop:'20%', width:'80%', marginBottom:20, textAlign:'center'}}>Attaching your breast self-exam to a routine activity like your typical shower is a good way to build a habit.</Text>)
              content.push(<Text style={{'color':'#fff', 'width':'80%', marginBottom:20, textAlign:'center'}}>What time would you like us to send you a once-a-month reminder?</Text>)
              content.push(<DateTimePicker name={'reminder_time'} answer={this.state.reminder_time} handleChange={this.handleChange} time={true} />)
              content.push(<Button text={'Set'} selected={true} onPress={this.setReminderTime} />)
            }
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
