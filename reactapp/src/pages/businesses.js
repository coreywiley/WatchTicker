import React, { Component } from 'react';
import ajaxWrapper from "base/ajax.js";
import Wrapper from 'base/wrapper.js';
import MetaTags from 'react-meta-tags';

import {Form, TextInput, Select, PasswordInput, Navbar, NumberInput, GoogleAddress} from 'library';
import Card from 'projectLibrary/businessCard.js';
class Businesses extends Component {

  constructor(props) {
    super(props);
    this.state = {'businesses':[], filters:{'type':'', 'city':'', 'state':'', 'search':''}, 'loaded':false};

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
          var business = this.state.businesses[index]
          if (this.state.filters.type == '' || (this.state.filters.type == business['type'])) {
            if (this.state.filters.city == '' || (this.state.filters.city == business['city'])) {
              if (this.state.filters.state == '' || (this.state.filters.state == business['state'])) {
                var businessText = business.name + business.description + business.monday_special + business.tuesday_special + business.wednesday_special + business.thursday_special + business.friday_special  + business.saturday_special + business.sunday_special;
                if (this.state.filters.search == '' || businessText.toLowerCase().indexOf(this.state.filters.search.toLowerCase()) > -1) {
                  businessCards.push(<Card address={business['address']} imageUrl={business['main_image']} imageAlt={business['name']} name={business['name']} description={business['description'].substring(0,130) + '...'} button={'Read More'} button_type={'primary'} link={'/business/' + business['id'] + '/'} />)
                  if (usedTypes.indexOf(business['type']) == -1) {
                    types.push({'value':business['type'], 'text':business['type']})
                    usedTypes.push(business['type'])
                  }
                  if (usedCities.indexOf(business['city']) == -1) {
                    cities.push({'value':business['city'], 'text':business['city']})
                    usedCities.push(business['city'])
                  }
                  if (usedState.indexOf(business['state']) == -1) {
                    states.push({'value':business['state'], 'text':business['state']})
                    usedState.push(business['state'])
                  }
                }
              }
            }
          }
        }


        var Components = [Select,Select,Select, TextInput];
        var type = {'value':'', 'name':'type', 'label':'Type Of Restaurant', 'options':types, 'layout':'col-md-4 col-xs-6', 'defaultoption':''}
        var city = {'value':'', 'name':'city', 'label':'City', 'options':cities, 'layout':'col-md-4 col-xs-6', 'defaultoption':''}
        var state = {'value':'', 'name':'state', 'label':'State', 'options':states, 'layout':'col-md-4 col-xs-6', 'defaultoption':''}
        var search = {'value':'', 'name':'search', 'label':'Search Anything', 'layout':'col-md-12 col-xs-6', 'defaultoption':''}

        var ComponentProps = [type, city, state,search];
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
