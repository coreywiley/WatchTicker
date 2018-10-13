import React, { Component } from 'react';
import ajaxWrapper from "base/ajax.js";
import Wrapper from 'base/wrapper.js';
import MetaTags from 'react-meta-tags';

import {Form, TextInput, Select, PasswordInput, Navbar, NumberInput, GoogleAddress} from 'library';
import Card from 'projectLibrary/businessCard.js';
class Businesses extends Component {

  constructor(props) {
    super(props);
    this.state = {'businesses':[], filters:{'type':'', 'city':'', 'state':''}, 'loaded':false};

    this.businessCallback = this.businessCallback.bind(this);
    this.setGlobalState = this.setGlobalState.bind(this);
  }

    componentDidMount() {
        ajaxWrapper('GET','/api/home/business/?published=True', {}, this.businessCallback)
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
        var cities = [];
        var states = [];
        var types = [];
        var usedCities = [];
        var usedState = [];
        var usedTypes = [];

        if (this.state.loaded == true) {
        for (var index in this.state.businesses) {
          if (this.state.filters.type == '' || (this.state.filters.type == this.state.businesses[index]['type'])) {
            if (this.state.filters.city == '' || (this.state.filters.city == this.state.businesses[index]['city'])) {
              if (this.state.filters.state == '' || (this.state.filters.state == this.state.businesses[index]['state'])) {
                businessCards.push(<Card address={this.state.businesses[index]['address']} imageUrl={this.state.businesses[index]['main_image']} imageAlt={this.state.businesses[index]['name']} name={this.state.businesses[index]['name']} description={this.state.businesses[index]['description'].substring(0,130) + '...'} button={'Read More'} button_type={'primary'} link={'/business/' + this.state.businesses[index]['id'] + '/'} />)
                if (usedTypes.indexOf(this.state.businesses[index]['type']) == -1) {
                  types.push({'value':this.state.businesses[index]['type'], 'text':this.state.businesses[index]['type']})
                  usedTypes.push(this.state.businesses[index]['type'])
                }
                if (usedCities.indexOf(this.state.businesses[index]['city']) == -1) {
                  cities.push({'value':this.state.businesses[index]['city'], 'text':this.state.businesses[index]['city']})
                  usedCities.push(this.state.businesses[index]['city'])
                }
                if (usedState.indexOf(this.state.businesses[index]['state']) == -1) {
                  states.push({'value':this.state.businesses[index]['state'], 'text':this.state.businesses[index]['state']})
                  usedState.push(this.state.businesses[index]['state'])
                }
              }
            }
          }
        }


        var Components = [Select,Select,Select];
        var type = {'value':'', 'name':'type', 'label':'Type Of Restaurant', 'options':types, 'layout':'col-md-4 col-xs-6', 'defaultoption':''}
        var city = {'value':'', 'name':'city', 'label':'City', 'options':cities, 'layout':'col-md-4 col-xs-6', 'defaultoption':''}
        var state = {'value':'', 'name':'state', 'label':'State', 'options':states, 'layout':'col-md-4 col-xs-6', 'defaultoption':''}

        var ComponentProps = [type, city, state];
        var defaults = this.state.filters;

        var title = <h2>Filter</h2>
        var filters = <div className="container">
                <Form components={Components} layout={'row'} componentProps={ComponentProps} defaults={defaults} objectName={'business'} setGlobalState={this.setGlobalState} globalStateName={'filters'} autoSetGlobalState={true}/>
        </div>;

        var content = <div className="container">
        <MetaTags>
          <title>Find Local Business Deals | PatronGate</title>
          <meta name="description" content="Find Local Business Deals" />
          <meta property="og:title" content="Find Local Business Deals | PatronGate" />
        </MetaTags>
                <h1>Find Your Local Businesses</h1>
                <h4>Discover whats right around the corner.</h4>
                {filters}
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
