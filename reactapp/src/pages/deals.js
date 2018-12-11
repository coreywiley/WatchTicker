import React, { Component } from 'react';
import ajaxWrapper from "base/ajax.js";
import Wrapper from 'base/wrapper.js';
import MetaTags from 'react-meta-tags';

import {Form, TextInput, Select, PasswordInput, Navbar, NumberInput, GoogleAddress, Button} from 'library';

import Card from 'projectLibrary/dealCard.js';
import RadioList from 'projectLibrary/radioList.js';

import {
  BrowserView,
  MobileView,
  isBrowser,
  isMobile
} from "react-device-detect";

import Businesses from './businesses.js';

class Deals extends Component {

  constructor(props) {
    super(props);
    var search = '';
    var business_type = ['All'];
    var business_allowed = 'All'
    var deal_type = 'All'
    if (this.props.search) {
      search = this.props.search;
      if (search.startsWith("type:")) {
        if (search == 'type:FoodAndDrink') {
          deal_type = 'Food And Drink'
          business_allowed = ['Food Truck','Restaurant','Bar','Coffee House'];
        }
        else if (search == 'type:PersonalServices') {
          deal_type = 'Personal Services'
          business_allowed = ['Taxes'];
        }
        else if (search == 'type:Automotive') {
          deal_type = 'Automotive'
          business_allowed = ['Auto Cleaning','Auto Repair'];
        }
        else if (search == 'type:Retail') {
          deal_type = 'Retail'
          business_allowed = ['Arts and Crafts','Clothing and Accessories','Flowers','Sweets and Baskets'];
        }
        else if (search == 'type:HealthAndFitness') {
          deal_type = 'Health And Fitness'
          business_allowed = ['Dental','Gyms and Weightloss'];
        }
        else if (search == 'type:HomeServices') {
          deal_type = 'Home Services'
          business_allowed = ['Lawn and Garden','HVAC and Electrical','Plumbing','Cleaning Services'];
        }
        else if (search == 'type:BeautyAndSpas') {
          deal_type = 'Beauty And Spas'
          business_allowed = ['Barbers','Nail Salons','Hair Salons','Massage'];
        }
        else if (search == 'type:Pets') {
          deal_type = 'Pets'
          business_allowed = ['Pet Boarding','Pet Health','Pet Grooming'];
        }

        search = '';
      }
    }

    this.state = {deals:[], businesses_allowed: 'All', show_filters:true, filters:{'deal_type':deal_type, 'business_type':business_type, 'city':'All', 'state':'All', 'search':search}, 'loaded':false};

    this.dealCallback = this.dealCallback.bind(this);
    this.setGlobalState = this.setGlobalState.bind(this);
    this.toggleFilters = this.toggleFilters.bind(this);
    this.deg2rad = this.deg2rad.bind(this);
    this.getDistanceFromLatLonInKm = this.getDistanceFromLatLonInKm.bind(this);
    this.sortByKey = this.sortByKey.bind(this);
    this.setGlobalSearch = this.setGlobalSearch.bind(this);
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
      console.log("Set Global", name, value, typeof(value['business_type']))
      if (name == 'filters' && typeof(value['business_type']) == 'string') {
        console.log("Here")
        newState['filters'] = value
        var tempValue = this.state.filters.business_type.slice();
        if (typeof(tempValue) == 'string') {
          if (this.props.search == 'type:FoodAndDrink')
          tempValue = ['Restaurant','Food Truck','Bar']
        }

        if (value['business_type'] == 'All') {
          console.log("All together now.")
          newState['filters']['business_type'] = ['All']
        }
        else if (tempValue.indexOf(value['business_type']) > -1) {
          console.log("I'm here now.")

          tempValue.splice(tempValue.indexOf(value['business_type']), 1)
          newState['filters']['business_type'] = tempValue;
        }
        else {
          console.log("I'm over here now.")
          if (tempValue.indexOf('All') > -1) {
            newState['filters']['business_type'] = [value['business_type']]
          }
          else {
            tempValue.push(value['business_type'])
            newState['filters']['business_type'] = tempValue;
          }

        }
      }
      else {
        newState[name] = value
      }

       this.setState(newState, this.setGlobalSearch(newState['filters']['search']))
    }

    toggleFilters() {
      this.setState({'show_filters':!this.state.show_filters})
    }

    deg2rad(deg) {
      return deg * (Math.PI/180)
    }

    getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
      var R = 6371; // Radius of the earth in km
      var dLat = this.deg2rad(lat2-lat1);  // deg2rad below
      var dLon = this.deg2rad(lon2-lon1);
      var a =
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
        Math.sin(dLon/2) * Math.sin(dLon/2)
        ;
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      var d = R * c; // Distance in km
      return d;
    }

    sortByKey(array, key) {
        return array.sort(function(a, b) {
            var x = a[key]; var y = b[key];
            return ((x < y) ? -1 : ((x > y) ? 1 : 0));
        });
    }

    setGlobalSearch(search) {
      var filters = this.state.filters;
      filters['search'] = search;
      this.setState({'filters':filters}, this.props.setGlobalSearch(search));
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


          if (this.props.latLng) {
            var dealList = [];
            var latLng = this.props.latLng.split(',')
            var lat = latLng[0];
            var lng = latLng[1];

            for (var index in this.state.deals) {
              var deal = this.state.deals[index];
              var distance = (this.getDistanceFromLatLonInKm(lat,lng,deal.business.lat,deal.business.lng) * .62 * 1.3).toFixed(1); //changing to miles and then adding in 1.3x for slightly better estimation with roads.
              deal['distance'] = distance;
              dealList.push(deal);
            }
            console.log("Deal List",dealList)
             dealList = this.sortByKey(dealList, 'distance')
             console.log("dealList Sorted", dealList)
          }
          else {
            var dealList = this.state.deals;
          }

        for (var index in dealList) {
          var deal = dealList[index]

          var allowed = true;
          if (this.state.businesses_allowed != 'All' && this.state.businesses_allowed.indexOf(deal['business']['type']) == -1) {
            allowed = false;
          }

          if (deal && allowed) {


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
              if (this.state.filters.business_type.length == 0 || this.state.filters.business_type.indexOf('All') > -1 || this.state.filters.business_type.indexOf(deal['business']['type']) > -1) {
                if (this.state.filters.city == '' || this.state.filters.city == 'All' || (this.state.filters.city == deal['business']['city'])) {
                  if (this.state.filters.state == '' || this.state.filters.state == 'All' || (this.state.filters.state == deal['business']['state'])) {
                    var dealText = deal.name + deal.description;
                    if (this.props.search == '' || !this.props.search || dealText.toLowerCase().indexOf(this.props.search.toLowerCase()) > -1) {
                      dealCards.push(<Card distance={deal['distance']} imageUrl={deal['main_image']} imageAlt={deal['name']} name={deal['name']} description={deal['description']} city={deal['business']['city']} reviews={deal['business']['review']} button={'Read More'} button_type={'primary'} link={'/deal/' + deal['id'] + '/'} />)
                    }
                  }
                }
              }
            }
          }
        }


        var Components = [TextInput, RadioList, RadioList, RadioList, RadioList];
        var deal_type = {'value':'', 'name':'deal_type', 'label':'Type Of Deal', 'options':deal_types, 'defaultoption':''}
        var business_type = {'value':'', 'name':'business_type', 'label':'Type Of Business', 'options':business_types,  'defaultoption':''}
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


        var location = null;
        if (this.props.address) {
          var location = <p>Sorting by distance from <strong>{this.props.address.split('_').join(' ')}</strong></p>
        }

        var title = null;
        if (this.props.title != false) {
          if (this.props.search) {
            title = <div><h1 style={{'color':'#717a8f', fontSize:'30px'}}>results for '{this.props.search}'</h1>
            {location}
            <div style={{'width':'100%','borderBottom':'1px solid #ddd'}}></div>
            </div>
          }
          else {
            title = <div><h1 style={{'color':'#717a8f', fontSize:'30px'}}>Local Coupons & Deals of the Week</h1>
            {location}
            <div style={{'width':'100%','borderBottom':'1px solid #ddd'}}></div>
            </div>
          }

        }

        var toggleFilters = null;
        var businesses = null;
        if (this.props.toggleFilters != false) {
          var toggleFilters = <Button type={'light'} text={'Toggle Filters'} clickHandler={this.toggleFilters} />;
          if (this.props.show_businesses != false) {
            var businesses = <Businesses setGlobalSearch={this.setGlobalSearch} user_id={this.props.user_id} search={this.props.search} address={this.props.address} latLng={this.props.latLng} />
          }
        }


        var divClass = "container"
        if (isMobile) {
          divClass = "container-fluid"
        }



        var content = <div className={divClass}>
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
                <br/>
                <br/>
                {businesses}
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
