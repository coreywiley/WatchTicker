import React, { Component } from 'react';
import ajaxWrapper from "base/ajax.js";
import Wrapper from 'base/wrapper.js';

import {Form, TextInput, Select, PasswordInput, Navbar, NumberInput, GoogleAddress, Card} from 'library';

class DealForm extends Component {

  constructor(props) {
    super(props);
    this.state = {deals:[]};

    this.dealCallback = this.dealCallback.bind(this);
  }

    componentDidMount() {
        ajaxWrapper('GET','/api/home/deal/', {}, this.dealCallback)
    }

    dealCallback(result) {
      var deals = [];
      for (var index in result) {
        deals.push(result[index]['deal'])
      }
      this.setState({deals:deals})
    }

    render() {

        var dealCards = [];
        for (var index in this.state.deals) {
          dealCards.push(<Card name={this.state.deals[index]['name']} description={this.state.deals[index]['description']} button={'Read More'} button_type={'primary'} link={'/deal/' + this.state.deals[index]['id'] + '/'} />)
        }

        var content = <div className="container">
                <h2>Local Coupons & Deals of the Week</h2>
                <h4>Discover local businesses, see their daily specials and deals</h4>
                {dealCards}
        </div>;


        return (
            <Wrapper loaded={true} content={content} />
             );
    }
}
export default DealForm;
