import React from 'react';
import { StyleSheet, View } from 'react-native';
import ajaxWrapper from '../base/ajax.js';
import { Toast, Container, Header, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Text, Card, CheckBox, CardItem, List, ListItem, InputGroup, Input, Spinner } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import LeagueCard from '../localLibrary/leagueCard.js';
import CMCard from '../library/card.js';

class Doctors extends React.Component {
  constructor(props) {
        super(props);
        this.state = {
          doctors: [],
          loaded:false,
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
        var body= <View>
        <View>
        <Button key={'owned-' + index} iconRight onPress={this.chooseDoctor.bind(this,doctor)} >
          <Text>{doctor.name + ' ' + doctor.type}</Text>
        </Button>
        </View>
        </View>;

        doctorCards.push(<CMCard key={doctor.id} title={doctor.name} body={body} />)

      }




      return (
        <Content>
        {doctorCards}

        <Button onPress={this.chooseDoctor.bind(this,undefined)} full success>
          <Text>Add New Doctor</Text>
        </Button>
        </Content>
        )
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
