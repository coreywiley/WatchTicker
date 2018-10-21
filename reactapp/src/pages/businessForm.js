import React, { Component } from 'react';
import ajaxWrapper from "base/ajax.js";
import Wrapper from 'base/wrapper.js';
import MetaTags from 'react-meta-tags';

import {Form, TextInput, Select, PasswordInput, Navbar, NumberInput, GoogleAddress, TextArea, PhotoInput, Header} from 'library';

class BusinessForm extends Component {
    constructor(props) {
      super(props);
      this.state = {'name':'','description':'', 'phone':this.props.user.phone, 'email':this.props.user.email, 'website':'','owner': this.props.user_id, 'address':'', 'street':'', 'street2':'', 'city':'','state':'','zipcode':'', 'main_image':''};

      this.businessCallback = this.businessCallback.bind(this);
    }

    componentDidMount() {
      if (this.props.business_id) {
        console.log("Business Id Is A Thing!")
        ajaxWrapper('GET','/api/home/business/' + this.props.business_id + '/', {}, this.businessCallback)
      }
    }

    businessCallback(result) {
      console.log("Here", result)
      var business = result[0]['business']
      business['owner'] = business['owner_id']

      console.log("Business",business)
      this.setState(business)
    }

    render() {
        var Components = [TextInput,Select, GoogleAddress,TextArea, TextInput, TextInput, TextInput, PhotoInput, TextInput, TextInput, TextInput, TextInput, Header, TextInput, TextInput, TextInput, TextInput, TextInput, TextInput, TextInput];
        var name = {'value':'','name':'name','label':'Name','placeholder': 'Patron Gate', 'required':true}
        var type = {'value':'', 'name':'type', 'label':'Type Of Restaurant', 'options':[{'value':'Bar','text':'Bar'},{'value':'Restaurant','text':'Restaurant'}, {'value':'Food Truck','text':'Food Truck'}]}
        var google_address = {'names':['address','street','street2','city','state','zipcode']}
        var description = {'value':'','name':'description','label':'Description','placeholder': 'We are a Vikings bar! Make sure you are here for the game on Sunday!'}
        var email = {'value':'','name':'email','label':'Email','placeholder': 'somanydeals@patrongate.com'}
        var phone = {'value':'','name':'phone','label':'Phone','placeholder': '(303) 819-9716'}
        var website = {'value':'','name':'website','label':'Website','placeholder': 'http://www.patrongate.com'}
        var main_image = {'value':'', 'name':'main_image', 'label':'Display Image', 'multiple':false}
        var facebook = {'value':'','name':'facebook','label':'Facebook Link','placeholder': 'Facebook Url', 'required': false}
        var twitter = {'value':'','name':'twitter','label':'Twitter Link','placeholder': 'Twitter Url', 'required':false}
        var instagram = {'value':'','name':'instagram','label':'Instagram Link','placeholder': 'Instagram Url', 'required':false}
        var yelp = {'value':'','name':'yelp','label':'Yelp Link','placeholder': 'Yelp! Url', 'required':false}

        var specials = {'text':'Weekly Specials', 'size':3}
        var monday = {'value':'','name':'monday_special','label':'Monday Special','placeholder': '1/2 Off Seafood Mondays', 'required':false}
        var tuesday = {'value':'','name':'tuesday_special','label':'Tuesday Special','placeholder': '1/2 Off Tacos Tuesday', 'required':false}
        var wednesday = {'value':'','name':'wednesday_special','label':'Wednesday Special','placeholder': 'Free Drinks Til 6!', 'required':false}
        var thursday = {'value':'','name':'thursday_special','label':'Thursday Special','placeholder': 'Ladies Night! Ladies drink free.', 'required':false}
        var friday = {'value':'','name':'friday_special','label':'Friday Special','placeholder': 'Fire It Up With A Free Pizza Friday', 'required':false}
        var saturday = {'value':'','name':'saturday_special','label':'Saturday Special','placeholder': 'Saturday 1/2 Off Well Drinks', 'required':false}
        var sunday = {'value':'','name':'sunday_special','label':'Sunday Special','placeholder': 'Sunday Football 1/2 Drinks All Day', 'required':false}


        var ComponentProps = [name, type, google_address, description, email, phone, website, main_image, facebook, twitter, instagram, yelp, specials, monday, tuesday, wednesday, thursday, friday, saturday, sunday];
        var defaults = this.state;

        var title = <h2>List Your Business</h2>
        var submitUrl = "/api/home/business/";
        if (this.props.business_id) {
          title = <h2>Edit Your Business Details</h2>
          submitUrl += this.props.business_id + '/';
        }

        var redirectUrl = "/business/{id}/"

        var deleteUrl = undefined;
        if (this.props.business_id) {
          deleteUrl = submitUrl + 'delete/';
        }
        var deleteRedirectUrl = '/manageYourBusinesses/'

        var content = <div className="container">
        <MetaTags>
          <title>Find Local Business Deals | PatronGate</title>
          <meta name="description" content="Find Local Business Deals" />
          <meta property="og:title" content="Find Local Business Deals | PatronGate" />
        </MetaTags>
                {title}
                <p>You can save and edit later if you need more time.</p>
                <Form components={Components} redirectUrl={redirectUrl} componentProps={ComponentProps} deleteUrl={deleteUrl} deleteRedirectUrl={deleteRedirectUrl} submitUrl={submitUrl} defaults={defaults} objectName={'business'} />
        </div>;


        return (
            <Wrapper loaded={true} content={content} />
             );
    }
}
export default BusinessForm;
