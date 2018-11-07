import React, { Component } from 'react';
import ajaxWrapper from "base/ajax.js";
import Wrapper from 'base/wrapper.js';
import MetaTags from 'react-meta-tags';

import {Form, TextInput, Select, PasswordInput, Navbar, NumberInput, GoogleAddress, Button} from 'library';

import Card from 'projectLibrary/dealCard.js';
import RadioList from 'projectLibrary/radioList.js';

class Deals extends Component {

  constructor(props) {
    super(props);
    var search = '';
    if (this.props.search) {
      search = this.props.search;
    }

    this.state = {deals:[], show_filters:true, filters:{'deal_type':'All', 'business_type':'All', 'city':'All', 'state':'All', 'search':search}, 'loaded':false};

    this.dealCallback = this.dealCallback.bind(this);
    this.setGlobalState = this.setGlobalState.bind(this);
    this.toggleFilters = this.toggleFilters.bind(this);
  }

    componentDidMount() {
      var order_by = "-last_published";
      if (this.props.order_by) {
        order_by = this.props.order_by;
      }

      if (this.props.limit) {
        ajaxWrapper('GET','/api/home/deal/?order_by=' + order_by + '&business__published=True&published=True&related=business,business__review&limit=' + this.props.limit, {}, this.dealCallback)
      }
      else {
        ajaxWrapper('GET','/api/home/deal/?order_by=' + order_by + '&business__published=True&published=True&related=business,business__review', {}, this.dealCallback)
      }

      if (this.props.filters == false) {
        this.setState({'show_filters':false})
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

    toggleFilters() {
      this.setState({'show_filters':!this.state.show_filters})
    }

    render() {

        var dealCards = [];
        var cities = ['All'];
        var states = ['All'];
        var business_types = ['All'];
        var deal_types = ['All'];
        var usedCities = [];
        var usedState = [];
        var usedDealTypes = [];
        var usedBusinessTypes = [];

        if (this.state.loaded == true) {
        for (var index in this.state.deals) {
          var deal = this.state.deals[index]
          if (usedDealTypes.indexOf(deal['type']) == -1) {
            deal_types.push(deal['type'])
            usedDealTypes.push(deal['type'])
          }
          if (usedBusinessTypes.indexOf(deal['business']['type']) == -1) {
            business_types.push(deal['business']['type'])
            usedBusinessTypes.push(deal['business']['type'])
          }
          if (usedCities.indexOf(deal['business']['city']) == -1) {
            cities.push(deal['business']['city'])
            usedCities.push(deal['business']['city'])
          }
          if (usedState.indexOf(deal['business']['state']) == -1) {
            states.push(deal['business']['state'])
            usedState.push(deal['business']['state'])
          }


          if (this.state.filters.deal_type == '' || this.state.filters.deal_type == 'All' || (this.state.filters.deal_type == deal['type'])) {
            if (this.state.filters.business_type == '' || this.state.filters.business_type == 'All' || (this.state.filters.business_type == deal['business']['type'])) {
              if (this.state.filters.city == '' || this.state.filters.city == 'All' || (this.state.filters.city == deal['business']['city'])) {
                if (this.state.filters.state == '' || this.state.filters.state == 'All' || (this.state.filters.state == deal['business']['state'])) {
                  var dealText = deal.name + deal.description;
                  if (this.state.filters.search == '' || dealText.toLowerCase().indexOf(this.state.filters.search.toLowerCase()) > -1) {
                    dealCards.push(<Card imageUrl={deal['main_image']} imageAlt={deal['name']} name={deal['name']} description={deal['description']} city={deal['business']['city']} reviews={deal['business']['review']} button={'Read More'} button_type={'primary'} link={'/deal/' + deal['id'] + '/'} />)
                  }
                }
              }
            }
          }
        }


        var Components = [TextInput, RadioList, RadioList, RadioList, RadioList];
        var deal_type = {'value':'', 'name':'deal_type', 'label':'Type Of Deal', 'options':deal_types, 'defaultoption':''}
        var business_type = {'value':'', 'name':'business_type', 'label':'Type Of Restaurant', 'options':business_types,  'defaultoption':''}
        var city = {'value':'', 'name':'city', 'label':'City', 'options':cities, 'defaultoption':''}
        var state = {'value':'', 'name':'state', 'label':'State', 'options':states,  'defaultoption':''}
        var search = {'value':'', 'name':'search', 'label':'Search Anything',  'defaultoption':''}

        var ComponentProps = [search, deal_type, business_type, city, state];
        var defaults = this.state.filters;

        var filters = null;
        if (this.state.show_filters != false) {
          var filters = <div className="col-md-4">
                  <Form components={Components} componentProps={ComponentProps} defaults={defaults} objectName={'business'} setGlobalState={this.setGlobalState} globalStateName={'filters'} autoSetGlobalState={true}/>
          </div>;
        }


        var title = null;
        if (this.props.title != false) {
          if (this.props.search) {
            title = <div><h1 style={{'color':'#717a8f', fontSize:'30px'}}>results for '{this.props.search}'</h1>
            <div style={{'width':'100%','borderBottom':'1px solid #ddd'}}></div>
            </div>
          }
          else {
            title = <div><h1 style={{'color':'#717a8f', fontSize:'30px'}}>Local Coupons & Deals of the Week</h1>
            <div style={{'width':'100%','borderBottom':'1px solid #ddd'}}></div>
            </div>
          }

        }

        var toggleFilters = null;
        if (this.props.toggleFilters != false) {
          var toggleFilters = <Button type={'light'} text={'Toggle Filters'} clickHandler={this.toggleFilters} />;
        }

        var content = <div className="container">
        <MetaTags>
          <title>Best Deals and Coupons</title>
          <meta name="description" content="About on PatronGate | You're hungry and we're here to help ..." />
          <meta property="og:title" content="Best Deals and Coupons" />
        </MetaTags>
                {title}
                {toggleFilters}
                <br/>
                {filters}
                <div className="row">
                  {dealCards}
                </div>
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
