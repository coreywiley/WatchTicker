import React, { Component } from 'react';
import ajaxWrapper from "base/ajax.js";
import Wrapper from 'base/wrapper.js';
import MetaTags from 'react-meta-tags';

import {Form, TextInput, Select, PasswordInput, Navbar, NumberInput, GoogleAddress} from 'library';
import Card from 'projectLibrary/dealCard.js';

class Deals extends Component {

  constructor(props) {
    super(props);
    this.state = {deals:[], filters:{'deal_type':'', 'business_type':'', 'city':'', 'state':''}, 'loaded':false};

    this.dealCallback = this.dealCallback.bind(this);
    this.setGlobalState = this.setGlobalState.bind(this);
  }

    componentDidMount() {
      if (this.props.limit) {
        ajaxWrapper('GET','/api/home/deal/?order_by=-last_published&published=True&related=business&limit=' + this.props.limit, {}, this.dealCallback)
      }
      else {
        ajaxWrapper('GET','/api/home/deal/?order_by=-last_published&published=True&related=business', {}, this.dealCallback)
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
          if (this.state.filters.deal_type == '' || (this.state.filters.deal_type == this.state.deals[index]['type'])) {
            if (this.state.filters.business_type == '' || (this.state.filters.business_type == this.state.deals[index]['business']['type'])) {
              if (this.state.filters.city == '' || (this.state.filters.city == this.state.deals[index]['business']['city'])) {
                if (this.state.filters.state == '' || (this.state.filters.state == this.state.deals[index]['business']['state'])) {
                  dealCards.push(<Card imageUrl={this.state.deals[index]['main_image']} imageAlt={this.state.deals[index]['name']} name={this.state.deals[index]['name']} description={this.state.deals[index]['description']} button={'Read More'} button_type={'primary'} link={'/deal/' + this.state.deals[index]['id'] + '/'} />)
                  if (usedDealTypes.indexOf(this.state.deals[index]['type']) == -1) {
                    deal_types.push({'value':this.state.deals[index]['type'], 'text':this.state.deals[index]['type']})
                    usedDealTypes.push(this.state.deals[index]['type'])
                  }
                  if (usedBusinessTypes.indexOf(this.state.deals[index]['business']['type']) == -1) {
                    business_types.push({'value':this.state.deals[index]['business']['type'], 'text':this.state.deals[index]['business']['type']})
                    usedBusinessTypes.push(this.state.deals[index]['business']['type'])
                  }
                  if (usedCities.indexOf(this.state.deals[index]['business']['city']) == -1) {
                    cities.push({'value':this.state.deals[index]['business']['city'], 'text':this.state.deals[index]['business']['city']})
                    usedCities.push(this.state.deals[index]['business']['city'])
                  }
                  if (usedState.indexOf(this.state.deals[index]['business']['state']) == -1) {
                    states.push({'value':this.state.deals[index]['business']['state'], 'text':this.state.deals[index]['business']['state']})
                    usedState.push(this.state.deals[index]['business']['state'])
                  }
                }
              }
            }
          }
        }


        var Components = [Select,Select,Select,Select];
        var deal_type = {'value':'', 'name':'deal_type', 'label':'Type Of Deal', 'options':deal_types, 'layout':'col-md-3 col-xs-6', 'defaultoption':''}
        var business_type = {'value':'', 'name':'business_type', 'label':'Type Of Restaurant', 'options':business_types, 'layout':'col-md-3 col-xs-6', 'defaultoption':''}
        var city = {'value':'', 'name':'city', 'label':'City', 'options':cities, 'layout':'col-md-3 col-xs-6', 'defaultoption':''}
        var state = {'value':'', 'name':'state', 'label':'State', 'options':states, 'layout':'col-md-3 col-xs-6', 'defaultoption':''}

        var ComponentProps = [deal_type, business_type, city, state];
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
