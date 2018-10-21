import React, { Component } from 'react';
import ajaxWrapper from "base/ajax.js";
import Wrapper from 'base/wrapper.js';
import MetaTags from 'react-meta-tags';

import {Form, TextInput, Select, PasswordInput, Navbar, NumberInput, GoogleAddress, Button} from 'library';
import Card from 'projectLibrary/businessCard.js';
class Businesses extends Component {

  constructor(props) {
    super(props);
    this.state = {'businesses':[], filters:{'type':'', 'city':'', 'state':''}, 'loaded':false};

    this.businessCallback = this.businessCallback.bind(this);
    this.setGlobalState = this.setGlobalState.bind(this);
  }

    componentDidMount() {
        ajaxWrapper('GET','/api/home/business/?owner=' + this.props.user_id, {}, this.businessCallback)
    }

    businessCallback(result) {
      var businesses = [];
      for (var index in result) {
        businesses.push(result[index]['business'])
      }
      this.setState({businesses:businesses, loaded:true})
    }

    setGlobalState(name, value) {
      var newState = {}
      newState[name] = value
       this.setState(newState)
    }

    render() {

        var businessCards = [];
        if (this.state.loaded == true) {
          for (var index in this.state.businesses) {
            businessCards.push(<Card address={this.state.businesses[index]['address']} imageUrl={this.state.businesses[index]['main_image']} imageAlt={this.state.businesses[index]['name']} name={this.state.businesses[index]['name']} description={this.state.businesses[index]['description'].substring(0,130) + '...'} button={'View'} button_type={'primary'} link={'/business/' + this.state.businesses[index]['id'] + '/'} />)
          }



        var content = <div className="container">
        <MetaTags>
          <title>Manage Your Businesses | PatronGate</title>
          <meta name="description" content="Find Local Business Deals" />
          <meta property="og:title" content="Find Local Business Deals | PatronGate" />
        </MetaTags>
                <h1>Manage Your Businesses</h1>
                <Button type={'patron'} text={'Add New Business'} href={'/businessForm/'} />
                {businessCards}
        </div>;
      }
      else {
        content = <div></div>
      }

        return (
            <Wrapper loaded={this.state.loaded} content={content} />
             );
    }
}
export default Businesses;
