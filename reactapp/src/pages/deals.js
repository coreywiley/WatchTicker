import React, { Component } from 'react';
import ajaxWrapper from "base/ajax.js";
import Wrapper from 'base/wrapper.js';
import MetaTags from 'react-meta-tags';

import {Form, TextInput, Select, PasswordInput, Navbar, NumberInput, GoogleAddress} from 'library';
import Card from 'projectLibrary/dealCard.js';

class Deals extends Component {

  constructor(props) {
    super(props);
    this.state = {deals:[], filters:{'deal_type':'', 'business_type':'', 'city':'', 'state':'', 'search':''}, 'loaded':false};

    this.dealCallback = this.dealCallback.bind(this);
    this.setGlobalState = this.setGlobalState.bind(this);
  }

    componentDidMount() {
      if (this.props.limit) {
        ajaxWrapper('GET','/api/home/deal/?order_by=-last_published&business__published=True&published=True&related=business&limit=' + this.props.limit, {}, this.dealCallback)
      }
      else {
        ajaxWrapper('GET','/api/home/deal/?order_by=-last_published&business__published=True&published=True&related=business', {}, this.dealCallback)
      }
    }

    dealCallback(result) {
      var deals = [];
      for (var index in result) {
        deals.push(result[index]['deal'])
      }
      this.setState({deals:deals, 'loaded':true})
    }

    setGlobalState(name, value) {
      var newState = {}
      newState[name] = value
       this.setState(newState)
    }

    render() {

        var dealCards = [];
        var cities = [];
        var states = [];
        var business_types = [];
        var deal_types = [];
        var usedCities = [];
        var usedState = [];
        var usedDealTypes = [];
        var usedBusinessTypes = [];

        if (this.state.loaded == true) {
        for (var index in this.state.deals) {
          var deal = this.state.deals[index]
          if (this.state.filters.deal_type == '' || (this.state.filters.deal_type == deal['type'])) {
            if (this.state.filters.business_type == '' || (this.state.filters.business_type == deal['business']['type'])) {
              if (this.state.filters.city == '' || (this.state.filters.city == deal['business']['city'])) {
                if (this.state.filters.state == '' || (this.state.filters.state == deal['business']['state'])) {
                  var dealText = deal.name + deal.description;
                  if (this.state.filters.search == '' || dealText.toLowerCase().indexOf(this.state.filters.search.toLowerCase()) > -1) {
                    dealCards.push(<Card imageUrl={deal['main_image']} imageAlt={deal['name']} name={deal['name']} description={deal['description']} button={'Read More'} button_type={'primary'} link={'/deal/' + deal['id'] + '/'} />)
                    if (usedDealTypes.indexOf(deal['type']) == -1) {
                      deal_types.push({'value':deal['type'], 'text':deal['type']})
                      usedDealTypes.push(deal['type'])
                    }
                    if (usedBusinessTypes.indexOf(deal['business']['type']) == -1) {
                      business_types.push({'value':deal['business']['type'], 'text':deal['business']['type']})
                      usedBusinessTypes.push(deal['business']['type'])
                    }
                    if (usedCities.indexOf(deal['business']['city']) == -1) {
                      cities.push({'value':deal['business']['city'], 'text':deal['business']['city']})
                      usedCities.push(deal['business']['city'])
                    }
                    if (usedState.indexOf(deal['business']['state']) == -1) {
                      states.push({'value':deal['business']['state'], 'text':deal['business']['state']})
                      usedState.push(deal['business']['state'])
                    }
                  }
                }
              }
            }
          }
        }


        var Components = [Select,Select,Select,Select, TextInput];
        var deal_type = {'value':'', 'name':'deal_type', 'label':'Type Of Deal', 'options':deal_types, 'layout':'col-md-3 col-xs-6', 'defaultoption':''}
        var business_type = {'value':'', 'name':'business_type', 'label':'Type Of Restaurant', 'options':business_types, 'layout':'col-md-3 col-xs-6', 'defaultoption':''}
        var city = {'value':'', 'name':'city', 'label':'City', 'options':cities, 'layout':'col-md-3 col-xs-6', 'defaultoption':''}
        var state = {'value':'', 'name':'state', 'label':'State', 'options':states, 'layout':'col-md-3 col-xs-6', 'defaultoption':''}
        var search = {'value':'', 'name':'search', 'label':'Search Anything', 'layout':'col-md-12 col-xs-12', 'defaultoption':''}

        var ComponentProps = [deal_type, business_type, city, state, search];
        var defaults = this.state.filters;

        var title = <h2>Filter</h2>
        var filters = <div className="container">
                <Form components={Components} layout={'row'} componentProps={ComponentProps} defaults={defaults} objectName={'business'} setGlobalState={this.setGlobalState} globalStateName={'filters'} autoSetGlobalState={true}/>
        </div>;

        var content = <div className="container">
        <MetaTags>
          <title>Best Deals and Coupons</title>
          <meta name="description" content="About on PatronGate | You're hungry and we're here to help ..." />
          <meta property="og:title" content="Best Deals and Coupons" />
        </MetaTags>
                <h1 style={{'color':'#717a8f', fontSize:'30px'}}>Local Coupons & Deals of the Week</h1>
                <p  style={{'color':'#949db2', fontSize:'16px'}}>Discover local businesses, see their daily specials and deals</p>
                {filters}
                {dealCards}
        </div>;
      }
      else{
        var content = <div></div>
      }

        return (
            <Wrapper loaded={this.state.loaded} content={content} />
             );
    }
}
export default Deals;
