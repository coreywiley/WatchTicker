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
        var Components = [TextInput,Select, GoogleAddress,TextArea, TextInput, TextInput, TextInput, PhotoInput, TextInput, TextInput, TextInput, TextInput, Header, TextArea, TextArea, TextArea, TextArea, TextArea, TextArea, TextArea];
        var name = {'value':'','name':'name','label':'Name','placeholder': 'Patron Gate', 'required':true}
        var type = {'value':'', 'name':'type', 'label':'Type Of Restaurant', 'options':[{'value':'Coffee House','text':'Coffee House'},{'value':'Bar','text':'Bar'},{'value':'Restaurant','text':'Restaurant'}, {'value':'Food Truck','text':'Food Truck'}]}
        var google_address = {'names':['address','street','street2','city','state','zipcode']}
        var description = {'value':'','name':'description','label':'Description','placeholder': ''}
        var email = {'value':'','name':'email','label':'Email','placeholder': ''}
        var phone = {'value':'','name':'phone','label':'Phone','placeholder': ''}
        var website = {'value':'','name':'website','label':'Website','placeholder': ''}
        var main_image = {'value':'', 'name':'main_image', 'label':'Display Image', 'multiple':false}
        var facebook = {'value':'','name':'facebook','label':'Facebook Link','placeholder': 'Facebook Url', 'required': false}
        var twitter = {'value':'','name':'twitter','label':'Twitter Link','placeholder': 'Twitter Url', 'required':false}
        var instagram = {'value':'','name':'instagram','label':'Instagram Link','placeholder': 'Instagram Url', 'required':false}
        var yelp = {'value':'','name':'yelp','label':'Yelp Link','placeholder': 'Yelp! Url', 'required':false}

        var specials = {'text':'Weekly Specials', 'size':3}
        var monday = {'value':'','name':'monday_special','label':'Monday Special','placeholder': '', 'required':false}
        var tuesday = {'value':'','name':'tuesday_special','label':'Tuesday Special','placeholder': '', 'required':false}
        var wednesday = {'value':'','name':'wednesday_special','label':'Wednesday Special','placeholder': '', 'required':false}
        var thursday = {'value':'','name':'thursday_special','label':'Thursday Special','placeholder': '', 'required':false}
        var friday = {'value':'','name':'friday_special','label':'Friday Special','placeholder': '', 'required':false}
        var saturday = {'value':'','name':'saturday_special','label':'Saturday Special','placeholder': '', 'required':false}
        var sunday = {'value':'','name':'sunday_special','label':'Sunday Special','placeholder': '', 'required':false}


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
                <Form submit_on_enter={false} components={Components} redirectUrl={redirectUrl} componentProps={ComponentProps} deleteUrl={deleteUrl} deleteRedirectUrl={deleteRedirectUrl} submitUrl={submitUrl} defaults={defaults} objectName={'business'} />
        </div>;


        return (
            <Wrapper loaded={true} content={content} />
             );
    }
}
export default BusinessForm;
