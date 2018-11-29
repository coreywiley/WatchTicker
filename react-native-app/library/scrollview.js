import React, { Component } from 'react';
import { Text, View, StyleSheet, Picker } from 'react-native';
import { Constants } from 'expo';

export default class App extends Component {
  constructor(props) {
    super(props);

    if (this.props.answer == '') {
      this.state = {
        month: 'January',
        day: '1',
        year:'2000',
      }
    }
    else {
      var values = this.props.answer.split(' ')
      this.state = {
        month: values[0],
        day: values[1],
        year:values[2],
      }
    }

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(name, value) {
    var newState = this.state;
    newState[name] = value;

    this.setState(newState, () => this.props.handleChange('answer', newState.month + ' ' + newState.day + ' ' + newState.year + ' '))

  }

  render() {

    var picker = <Picker
      style={{width: 100}}
      selectedValue={this.state.language}
      onValueChange={(lang) => this.setState({language: lang})}>
      <Picker.Item label="Java" value="java" />
      <Picker.Item label="JavaScript" value="js" />
    </Picker>;

    if (this.props.date) {
      var days = [];
      var monthdays = {'January':31, 'February':29, 'March':31, 'April':30, 'May':31,'June':30,'July':31,'August':31,'September':30,'October':31,'November':30,'December':31}
      for (var i = 0; i < monthdays[this.state.month]; i++) {
        var day = (i+1).toString()
        days.push(<Picker.Item label={day} value={day} />)
      }

      var years = [];
      for (var i = 0; i < 150; i++) {
        var year = (2018-150+i).toString();
        years.push(<Picker.Item label={year} value={year} />)
      }

      var picker = <View>
      <Picker
        style={{width: 100}}
        selectedValue={this.state.month}
        onValueChange={(lang) => this.handleChange('month',lang)}>
        <Picker.Item label="January" value="January" />
        <Picker.Item label="February" value="February" />
        <Picker.Item label="March" value="March" />
        <Picker.Item label="April" value="April" />
        <Picker.Item label="May" value="May" />
        <Picker.Item label="June" value="June" />
        <Picker.Item label="July" value="July" />
        <Picker.Item label="August" value="August" />
        <Picker.Item label="September" value="September" />
        <Picker.Item label="October" value="October" />
        <Picker.Item label="November" value="November" />
        <Picker.Item label="December" value="December" />
      </Picker>
      <Picker
        style={{width: 100}}
        selectedValue={this.state.day}
        onValueChange={(lang) => this.handleChange('day',lang)}>
        {days}
      </Picker>
      <Picker
        style={{width: 100}}
        selectedValue={this.state.year}
        onValueChange={(lang) => this.handleChange('year',lang)}>
        {years}
      </Picker></View>;
    }

    return (
      <View style={styles.container}>
        {picker}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#ecf0f1',
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#34495e',
  },
});
