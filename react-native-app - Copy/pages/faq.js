import React from 'react';
import { StyleSheet, View } from 'react-native';
import ajaxWrapper from '../base/ajax.js';
import { Toast, Container, Header, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Card, CheckBox, CardItem, List, ListItem, InputGroup, Input, Spinner } from 'native-base';
import LeagueCard from '../localLibrary/leagueCard.js';
import CMCard from '../library/card.js';
import Text from '../library/text.js';

class FAQs extends React.Component {
  constructor(props) {
        super(props);
        this.state = {
          faqs: [],
          loaded:false,
        };

        this.faqCallback = this.faqCallback.bind(this);
        this.chooseDoctor = this.chooseDoctor.bind(this);

      }

    componentDidMount() {
      console.log("Running Ajax")
      ajaxWrapper('GET','/api/home/faq/?archived=false&order_by=order', {}, this.faqCallback)
    }

    faqCallback(result) {
      var faqs = [];
      for (var index in result) {
        var faq = result[index]['faq'];
        faqs.push(faq)
      }

      this.setState({faqs:faqs, loaded:true})
    }

    chooseDoctor(faq) {

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

      faqCards = [];

      for (var index in this.state.faqs) {
        var faq = this.state.faqs[index]

        faqCards.push(<View style={{padding:20, borderBottomWidth:2, borderColor:'#aaa'}}><Text style={{'color':'#ad59a3', marginBottom:20}}>{faq.question}</Text><Text style={{'color':'#53c0a7'}}>{faq.answer}</Text></View>)

      }

      return (
        <Content>
        {faqCards}
        </Content>
        )
    }
  }
}

export default FAQs;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
