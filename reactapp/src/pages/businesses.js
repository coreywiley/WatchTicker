import React, { Component } from 'react';
import ajaxWrapper from "base/ajax.js";
import Wrapper from 'base/wrapper.js';

import {Form, TextInput, Select, PasswordInput, Navbar, NumberInput, GoogleAddress, Card} from 'library';

class DealForm extends Component {

  constructor(props) {
    super(props);
    this.state = {businesses:[]};

    this.businessCallback = this.businessCallback.bind(this);
  }

    componentDidMount() {
        ajaxWrapper('GET','/api/home/business/', {}, this.businessCallback)
    }

    businessCallback(result) {
      var businesses = [];
      for (var index in result) {
        businesses.push(result[index]['business'])
      }
      this.setState({businesses:businesses})
    }

    render() {

        var businessCards = [];
        for (var index in this.state.businesses) {
          businessCards.push(<Card name={this.state.businesses[index]['name']} description={this.state.businesses[index]['description']} button={'Read More'} button_type={'primary'} link={'/business/' + this.state.businesses[index]['id'] + '/'} />)
        }

        var content = <div className="container">
                <h2>Local Businesses</h2>
                <h4>Discover whats right around the corner.</h4>
                {businessCards}
        </div>;


        return (
            <Wrapper loaded={true} content={content} />
             );
    }
}
export default DealForm;
