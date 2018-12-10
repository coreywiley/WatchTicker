import React from 'react';
import { StyleSheet, View, ScrollView, Image, TouchableWithoutFeedback } from 'react-native';
import ajaxWrapper from '../base/ajax.js';
import { Toast, Container, Header, Title, Content, FooterTab, Left, Right, Body, Card, CheckBox, CardItem, List, ListItem, InputGroup, Input, Spinner, Textarea } from 'native-base';
import CMCard from '../library/card.js';
import Button from '../localLibrary/button.js';
import {LinearGradient} from 'expo';
import Text from '../library/text.js';
import Footer from '../localLibrary/footer.js';

var off = require('../assets/health/switch_off.png')
var on = require('../assets/health/switch_on.png')
var close = require('../assets/settings/close.png')

class Doctors extends React.Component {
  constructor(props) {
        super(props);
        this.state = {
          doctors: [],
          loaded:false,
          notes: false,
        };

        this.doctorCallback = this.doctorCallback.bind(this);
        this.chooseDoctor = this.chooseDoctor.bind(this);

      }

    componentDidMount() {
      console.log("Running Ajax")
      ajaxWrapper('GET','/api/home/doctor/?user=' + this.props.userId, {}, this.doctorCallback)
    }

    doctorCallback(result) {
      var doctors = [];
      for (var index in result) {
        var doctor = result[index]['doctor'];
        doctors.push(doctor)
      }

      this.setState({doctors:doctors, loaded:true})
    }

    chooseDoctor(doctor) {
      this.props.setGlobalState('doctor',doctor);
      this.props.setGlobalState('page','addDoctor');
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

      doctorCards = [];

      for (var index in this.state.doctors) {
        var doctor = this.state.doctors[index]

        if (this.state.doctors.length == index + 1) {
          var body = <View style={{'width':'80%', borderRadius:25, backgroundColor:'#bbd7d3', marginTop:10}}><View style={{'backgroundColor':'white', borderTopLeftRadius:25, borderTopRightRadius:25, width:'100%'}}>
          <TouchableWithoutFeedback onPress={() => this.chooseDoctor(doctor)}>
            <Text style={{color:'#a657a1',textAlign:'center'}}>{doctor.name + '\n' + doctor.type}</Text>
          </TouchableWithoutFeedback>
          </View>


          <View style={{borderBottomLeftRadius:25, borderBottomRightRadius:25, width:'100%'}}>
          <LinearGradient
            colors={['#bbb', '#fff','#fff']}
            style={{width:'100%', borderBottomLeftRadius:25, borderBottomRightRadius:25}}>
            <View style={{'flexDirection':'row', marginTop:10, marginLeft:20}}>
              <Text style={{color:'#a657a1',textAlign:'center'}}>Name: </Text>
              <Text style={{color:'#6bc8b3',textAlign:'center'}}> {doctor.name}</Text>
            </View>
            <View style={{'flexDirection':'row', marginTop:10, marginLeft:20}}>
              <Text style={{color:'#a657a1',textAlign:'center'}}>Phone: </Text>
              <Text style={{color:'#6bc8b3',textAlign:'center'}}> {doctor.phone}</Text>
            </View>
            <View style={{'flexDirection':'row', marginTop:10, marginBottom:10, marginLeft:20}}>
              <Text style={{color:'#a657a1',textAlign:'center'}}>Email: </Text>
              <Text style={{color:'#6bc8b3',textAlign:'center'}}> {doctor.email}</Text>
            </View>

              </LinearGradient>
          </View>

          </View>;
        }
        else {
          var body= <View style={{'backgroundColor':'white', borderTopLeftRadius:25, borderTopRightRadius:25, width:'80%'}}>
            <TouchableWithoutFeedback onPress={() => this.chooseDoctor(doctor)}>
              <Text style={{color:'#a657a1',textAlign:'center'}}>{doctor.name + '\n' + doctor.type}</Text>
            </TouchableWithoutFeedback>
          </View>;
        }


        doctorCards.push(body)

      }



      if (this.state.notes == false) {
        return (
          <View>
          <LinearGradient
            colors={['#52bfa6', '#3e8797']}
            style={{alignItems: 'center', 'height':'100%', 'width':'100%', 'height':'100%'}}>
          <ScrollView style={{'height':'100%','width':'100%'}}>
          <View style={{'height':'100%','width':'100%', alignItems:'center'}}>
          <Text style={{'color':'white', margin: 20}}>m    y        h    e    a    l    t    h</Text>

          {doctorCards}

          <Button width={'80%'} onPress={this.chooseDoctor.bind(this,undefined)} text={'Add New Doctor'} />

          <View style={{'width':'80%', marginTop:20, height:20, alignItems:'center', 'justifyContent':'center'}}>
            <View style={{'borderTopWidth':2, borderColor:'white', 'width':'100%'}}>
            </View>

            <Text style={{fontFamily: 'Quicksand', color:'white', position:'absolute', paddingRight:20, paddingLeft:20, backgroundColor:'#4db2a3', 'textAlign':'center', zIndex:1000}}>Appointment Reminders</Text>
          </View>

          <View style={{width:'80%', backgroundColor:'white', borderRadius:25, marginTop:10}}>
          <View style={{'flexDirection':'row', marginTop:20, marginLeft:20}}>
            <Text style={{color:'#a657a1',textAlign:'center'}}>Mammogram </Text>
            <View style={{position:'absolute', right:10}}>
            <Image source={off} style={{width: 60,height:30}} resizeMode="contain" />
            </View>
          </View>
          <View style={{'flexDirection':'row', marginTop:10, marginLeft:20}}>
            <Text style={{color:'#a657a1',textAlign:'center'}}>Gynocologist </Text>
            <View style={{position:'absolute', right:10}}>
            <Image source={on} style={{width: 60,height:30}} resizeMode="contain" />
            </View>
          </View>
          <View style={{'flexDirection':'row', marginTop:10, marginBottom:20, marginLeft:20}}>
            <Text style={{color:'#a657a1',textAlign:'center'}}>Physical </Text>
            <View style={{position:'absolute', right:10}}>
            <Image source={off} style={{width: 60,height:30}} resizeMode="contain" />
            </View>
          </View>
          </View>

          <View style={{'width':'80%', marginTop:20, height:20, alignItems:'center', 'justifyContent':'center'}}>
            <View style={{'borderTopWidth':2, borderColor:'white', 'width':'100%'}}>
            </View>

            <Text style={{fontFamily: 'Quicksand', color:'white', position:'absolute', paddingRight:20, paddingLeft:20, backgroundColor:'#48a49f', 'textAlign':'center', zIndex:1000}}>Appointment Notes</Text>
          </View>

          <TouchableWithoutFeedback onPress={() => this.setState({notes:true})}>
          <View style={{'width':'100%', alignItems:'center', justifyContent:'center', marginTop:20}}>
            <View style={{'backgroundColor': 'white', 'width':'80%', 'padding':10, borderTopLeftRadius: 25, borderTopRightRadius: 25}} >
            <Text style={{'color':'#a657a2', 'textAlign':'center'}}>Subject</Text>
            </View>
            <LinearGradient colors={['#bbb','#fff','#fff']} style={{'backgroundColor': 'white', 'width':'80%', 'padding':20,  alignItems:'center', justifyContent:'center', borderBottomLeftRadius: 25, borderBottomRightRadius: 25, flexDirection: 'row', flexWrap: 'wrap'}}>
              <Textarea style={{'width':'100%', 'color': '#56c0a6', 'fontFamily':'Quicksand'}} placeholderTextColor={'#56c0a6'} placeholder={'Add Notes'} onChangeText={(text) => this.handleChange('notes',text)} value={this.state.notes} rowSpan={3} />
            </LinearGradient>

          </View>
          </TouchableWithoutFeedback>

          <Button width={'80%'} onPress={this.chooseDoctor.bind(this,undefined)} text={'Export My Journal as PDF'} />

          <Button width={'80%'} onPress={() => this.props.setGlobalState('page','riskAssessment')} text={'My Risk Assessment'} />
          <View style={{'marginBottom':50}} />
          </View>
          </ScrollView>
          <Footer setGlobalState={this.props.setGlobalState} page={'journalEntries'} backgroundColor={'#a8cbd1'}/>
          </LinearGradient>
          </View>
          )
        }
        else {

          var save = <Button text={'Save'} purple={true} onPress={() => this.setState({notes:false})} />
          return (
            <View>
            <LinearGradient
              colors={['#52bfa6', '#3e8797']}
              style={{alignItems: 'center', 'height':'100%', 'width':'100%', 'height':'100%'}}>

            <Text style={{'color':'white', marginTop: 20}}>m    y        h    e    a    l    t    h</Text>

            <View style={{'alignItems':'center', justifyContent:'center', 'width':'100%'}}>

              <View style={{'backgroundColor': 'white', width:'80%', 'padding':10, borderTopLeftRadius: 25, borderTopRightRadius: 25}} >
                <Text style={{'color':'#a657a2', 'textAlign':'center', width:'100%'}}>Subject</Text>
              </View>

              <LinearGradient colors={['#bbb','#fff','#fff']} style={{'backgroundColor': 'white', 'width':'80%', height:'70%', 'padding':20, alignItems:'center', justifyContent:'center', borderBottomLeftRadius: 25, borderBottomRightRadius: 25, flexDirection: 'row', flexWrap: 'wrap'}}>
                <Textarea style={{'width':'100%', height:'75%', 'color': '#56c0a6', 'fontFamily':'Quicksand'}} placeholderTextColor={'#56c0a6'} placeholder={'Add Notes'} onChangeText={(text) => this.handleChange('notes',text)} value={this.state.notes} rowSpan={3} />
                {save}
              </LinearGradient>

              <TouchableWithoutFeedback onPress={() => this.setState({notes:false})} style={{'alignItems':'center', justifyContent:'center', flex: 1}}>
                <View style={{'textAlign':'center', 'position':'absolute','bottom':'7%', 'height':50, width:50, borderRadius:50, backgroundColor: 'white', zIndex:100}}>
                  <Image source={close} style={{width: 50,height:50}} resizeMode="contain" />
                </View>
              </TouchableWithoutFeedback>
            </View>

            </LinearGradient>
            </View>
          )
        }
    }
  }
}

export default Doctors;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
