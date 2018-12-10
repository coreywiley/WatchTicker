import React from 'react';
import { StyleSheet, View, Image, TouchableWithoutFeedback } from 'react-native';
import ajaxWrapper from '../base/ajax.js';
import { Toast, Container, Header, Title, Content, FooterTab, Left, Right, Body, Card, CheckBox, CardItem, List, ListItem, InputGroup, Input, Spinner } from 'native-base';
import LeagueCard from '../localLibrary/leagueCard.js';
import CMCard from '../library/card.js';
import CustomPhoto from '../localLibrary/customPhoto.js';
import {LinearGradient} from 'expo';
import Text from '../library/text.js';
import Button from '../localLibrary/button.js';
import Footer from '../localLibrary/footer.js';

import JournalCard from '../localLibrary/journalCard.js';

class Journals extends React.Component {
  constructor(props) {
        super(props);
        this.state = {
          journals: [],
          customize: null,
          loaded:false,
          currentIndex: 0,
        };

        this.journalCallback = this.journalCallback.bind(this);
        this.chooseJournal = this.chooseJournal.bind(this);
        this.customizeCallback = this.customizeCallback.bind(this);
        this.prev = this.prev.bind(this);
        this.next = this.next.bind(this);

      }

    componentDidMount() {
      console.log("Running Ajax")
      ajaxWrapper('GET','/api/home/journal/?related=symptoms&user=' + this.props.userId, {}, this.journalCallback)
      ajaxWrapper('GET','/api/home/customize/?user=' + this.props.userId, {}, this.customizeCallback)
    }

    journalCallback(result) {
      var journals = [];
      for (var index in result) {
        var journal = result[index]['journal'];
        journals.push(journal)
      }

      this.setState({journals:journals, loaded:true})
    }

    customizeCallback(result) {
      this.setState({customize: result[0]['customize']})
    }

    chooseJournal(journal) {
      this.props.setGlobalState('journal',journal);
      this.props.setGlobalState('customize', this.state.customize)
      this.props.setGlobalState('page','journal');
    }

    prev() {
      if (this.state.currentIndex < this.state.journals.length - 1) {
        this.setState({currentIndex: this.state.currentIndex + 1})
      }
    }

    next() {
      if (this.state.currentIndex > 0) {
        this.setState({currentIndex: this.state.currentIndex - 1})
      }
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

      var journal = this.state.journals[this.state.currentIndex];

      var circles = [];
      for (var i = 0; i < this.state.journals.length; i++) {
        var color = '#4baea1';
        if (i > this.state.currentIndex) {
          color = '#fff';
        }
        circles.push(<View style={{'backgroundColor':color, height: 6, width:6, borderRadius:3, margin:3}}></View>)
      }

      return (
        <LinearGradient
          colors={['#bd83b9', '#7d5d9b']}
          style={{alignItems: 'center', 'height':'100%', 'width':'100%'}}>

          <Text style={{'color':'white', marginTop: 20}}>m    y        j    o    u    r    n    a    l</Text>

          <JournalCard customize={this.state.customize} chooseJournal={this.chooseJournal} journal={journal} prev={this.prev} next={this.next} />

          <View style={{'flexDirection':'row', 'flexWrap':'wrap','alignItems':'flex-start', 'marginTop':10}}>
            {circles}
          </View>

          <Footer setGlobalState={this.props.setGlobalState} page={'journalEntries'} />

        </LinearGradient>
        )
    }
  }
}

export default Journals;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
