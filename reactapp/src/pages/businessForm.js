import React, { Component } from 'react';
import ajaxWrapper from "base/ajax.js";
import Wrapper from 'base/wrapper.js';

import {Form, TextInput, Select, PasswordInput, Navbar, NumberInput, GoogleAddress, TextArea} from 'library';

class BusinessForm extends Component {
    constructor(props) {
      super(props);
      this.state = {'name':'','description':'', 'phone':'', 'email':'', 'website':'','owner': this.props.user_id, 'address':'', 'street':'', 'street2':'', 'city':'','state':'','zipcode':''};

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
        var Components = [TextInput,GoogleAddress,TextArea, TextInput, TextInput, TextInput];
        var name = {'value':'','name':'name','label':'Name','placeholder': 'Patron Gate', 'required':true}
        var google_address = {'names':['address','street','street2','city','state','zipcode']}
        var description = {'value':'','name':'description','label':'Description','placeholder': 'We are a Vikings bar! Make sure you are here for the game on Sunday!'}
        var email = {'value':'','name':'email','label':'Email','placeholder': 'somanydeals@patrongate.com'}
        var phone = {'value':'','name':'phone','label':'Phone','placeholder': '(303) 819-9716'}
        var website = {'value':'','name':'website','label':'Website','placeholder': 'http://www.patrongate.com'}

        var ComponentProps = [name, google_address, description, email, phone, website];
        var defaults = this.state;

        var title = <h2>List Your Business</h2>
        var submitUrl = "/api/home/business/";
        if (this.props.business_id) {
          title = <h2>Edit Your Business Details</h2>
          submitUrl += this.props.business_id + '/';
        }

        var redirectUrl = "/business/{id}/"

        var content = <div className="container">
                {title}
                <Form components={Components} redirectUrl={redirectUrl} componentProps={ComponentProps} submitUrl={submitUrl} defaults={defaults} objectName={'business'} />
        </div>;


        return (
            <Wrapper loaded={true} content={content} />
             );
    }
}
export default BusinessForm;
