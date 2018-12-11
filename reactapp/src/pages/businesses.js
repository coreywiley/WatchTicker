import React, { Component } from 'react';
import ajaxWrapper from "base/ajax.js";
import Wrapper from 'base/wrapper.js';
import MetaTags from 'react-meta-tags';

import {Form, TextInput, Select, PasswordInput, Navbar, NumberInput, GoogleAddress, PageBreak, Button} from 'library';
import Card from 'projectLibrary/businessCard.js';
import RadioList from 'projectLibrary/radioList.js';

class Businesses extends Component {

  constructor(props) {
    super(props);

    var search = this.props.search;
    var business_type = 'All';
    var businesses_allowed = 'All';

    if (this.props.search) {
      if (search.startsWith("type:")) {
        if (search == 'type:FoodAndDrink') {
          business_type = ['Food Truck','Restaurant','Bar','Coffee House'];
        }
        else if (search == 'type:PersonalServices') {
          business_type = ['Taxes'];
        }
        else if (search == 'type:Automotive') {
          business_type = ['Auto Cleaning','Auto Repair'];
        }
        else if (search == 'type:Retail') {
          business_type = ['Arts and Crafts','Clothing and Accessories','Flowers','Sweets and Baskets'];
        }
        else if (search == 'type:HealthAndFitness') {
          business_type = ['Dental','Gyms and Weightloss'];
        }
        else if (search == 'type:HomeServices') {
          business_type = ['Lawn and Garden','HVAC and Electrical','Plumbing','Cleaning Services'];
        }
        else if (search == 'type:BeautyAndSpas') {
          business_type = ['Barbers','Nail Salons','Hair Salons','Massage'];
        }
        else if (search == 'type:Pets') {
          business_type = ['Pet Boarding','Pet Health','Pet Grooming'];
        }


        search = '';
        this.props.setGlobalSearch('')
      }
    }


    this.state = {'businesses':[], 'businesses_allowed':'All', show_filters:true, filters:{'type':business_type, 'city':'All', 'state':'All', 'search':search}, 'loaded':false};



    this.businessCallback = this.businessCallback.bind(this);
    this.setGlobalState = this.setGlobalState.bind(this);
    this.toggleFilters = this.toggleFilters.bind(this);
    this.favoritesCallback = this.favoritesCallback.bind(this);
  }

    componentDidMount() {
        if (this.props.limit) {
          ajaxWrapper('GET','/api/home/business/?order_by=-id&related=review&published=True&limit=' + this.props.limit, {}, this.businessCallback)
        }
        else if (this.props.favorites) {
          ajaxWrapper('GET','/api/home/follow/?order_by=-id&related=business,business__review&business__published=True&user_id=' + this.props.user_id, {}, this.favoritesCallback)
        }
        else {
          ajaxWrapper('GET','/api/home/business/?order_by=-id&related=review&published=True', {}, this.businessCallback)
        }
    }

    businessCallback(result) {
      var businesses = [];
      for (var index in result) {
        businesses.push(result[index]['business'])
      }
      this.setState({businesses:businesses, loaded:true})
    }

    favoritesCallback(result) {
      var businesses = [];
      for (var index in result) {
        businesses.push(result[index]['follow']['business'])
      }
      this.setState({businesses:businesses, loaded:true})
    }

    setGlobalState(name, value) {
      var newState = {}
      newState[name] = value

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

      var search = value['search'];
      console.log("Search Value", search)
      this.setState(newState, this.props.setGlobalSearch(search))
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

    render() {

        var businessCards = [];
        var cities = ['All'];
        var states = ['All'];
        var types = ['All'];
        var usedCities = [];
        var usedState = [];
        var usedTypes = [];

        if (this.state.loaded == true) {


          if (this.props.latLng) {
            var businessesList = [];
            var latLng = this.props.latLng.split(',')
            var lat = latLng[0];
            var lng = latLng[1];

            for (var index in this.state.businesses) {
              var business = this.state.businesses[index];
              var distance = (this.getDistanceFromLatLonInKm(lat,lng, business.lat, business.lng) * .62 * 1.3).toFixed(1); //changing to miles and then adding in 1.3x for slightly better estimation with roads.
              business['distance'] = distance;
              businessesList.push(business);
            }
            console.log("businessesList List",businessesList)
             businessesList = this.sortByKey(businessesList, 'distance')
             console.log("businessesList Sorted", businessesList)
          }
          else {
            var businessesList = this.state.businesses;
          }

        for (var index in businessesList) {
          var business = businessesList[index]
          var allowed = true;
          if (this.state.businesses_allowed != 'All' && this.state.businesses_allowed.indexOf(business['type']) == -1) {
            allowed = false;
          }

          if (business && allowed) {
            if (usedTypes.indexOf(business['type']) == -1) {
              types.push(business['type'])
              usedTypes.push(business['type'])
            }
            if (usedCities.indexOf(business['city']) == -1) {
              cities.push(business['city'])
              usedCities.push(business['city'])
            }
            if (usedState.indexOf(business['state']) == -1) {
              states.push(business['state'])
              usedState.push(business['state'])
            }
            if (this.state.businesses_allowed == 'All' || this.state.businesses_allowed.indexOf(business['type'])) {
              if (this.state.filters.type.length == 0 || this.state.filters.type.indexOf('All') > -1 || this.state.filters.type.indexOf(business['type']) > -1) {
                if (this.state.filters.city == '' || this.state.filters.city == 'All' || (this.state.filters.city == business['city'])) {
                  if (this.state.filters.state == '' || this.state.filters.state == 'All' || (this.state.filters.state == business['state'])) {
                    var businessText = business.name + business.description + business.monday_special + business.tuesday_special + business.wednesday_special + business.thursday_special + business.friday_special  + business.saturday_special + business.sunday_special;
                    if (this.props.search == '' || this.props.search == undefined || businessText.toLowerCase().indexOf(this.props.search.toLowerCase()) > -1) {
                      businessCards.push(<Card distance={business['distance']} address={business['address']} reviews={business['review']} imageUrl={business['main_image']} imageAlt={business['name']} name={business['name']} description={business['description'].substring(0,130) + '...'} button={'Read More'} button_type={'primary'} link={'/business/' + business['id'] + '/'} />)
                    }
                  }
                }
              }
            }
          }
        }


        var Components = [TextInput, RadioList,RadioList,RadioList];
        var type = {'value':'', 'name':'type', 'label':'Type Of Business', 'options':types, 'defaultoption':''}
        var city = {'value':'', 'name':'city', 'label':'City', 'options':cities, 'defaultoption':''}
        var state = {'value':'', 'name':'state', 'label':'State', 'options':states, 'defaultoption':''}
        var search = {'value':this.props.search, 'name':'search', 'label':'Search Anything', 'defaultoption':''}

        var ComponentProps = [search, type, city, state];
        var defaults = this.state.filters;
        defaults['search'] = this.props.search;

        var title = <h2>Filter</h2>

        var filters = null;
        if (this.props.filters != false && this.state.show_filters != false) {
          var filters = <div className="col-md-4">
                  <Form components={Components} componentProps={ComponentProps} defaults={defaults} objectName={'business'} setGlobalState={this.setGlobalState} globalStateName={'filters'} autoSetGlobalState={true}/>
          </div>;
        }

        var toggleFilters = null;
        if (this.props.toggleFilters != false) {
          var toggleFilters = <Button type={'light'} text={'Toggle Filters'} clickHandler={this.toggleFilters} />;
        }


        var title = <div>
          <h1>Find Your Local Businesses</h1>
          <h4 style={{'marginTop':'0px'}}>Discover whats right around the corner.</h4>
        </div>

        if (this.props.favorites) {
          title = <div>
            <h1>Search Your Favorite Local Businesses</h1>
            <h4 style={{'marginTop':'0px'}}>This list is curated from your favorited businesses.</h4>
          </div>
        }

        var content = <div className="container">
        <MetaTags>
          <title>Find Local Business Deals | PatronGate</title>
          <meta name="description" content="Find Local Business Deals" />
          <meta property="og:title" content="Find Local Business Deals | PatronGate" />
        </MetaTags>
                {title}
                <PageBreak />
                <br/>
                {toggleFilters}
                <br/>
                {filters}
                <div className='row'>
                    {businessCards}
                </div>
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
