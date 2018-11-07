import React, { Component } from 'react';
import ajaxWrapper from "base/ajax.js";
import Wrapper from 'base/wrapper.js';
import MetaTags from 'react-meta-tags';

import {Form, TextInput, Select, PasswordInput, Navbar, NumberInput, GoogleAddress, TextArea, DateTimePicker, PhotoInput} from 'library';

class DealForm extends Component {

  constructor(props) {
    super(props);
    this.state = {'name':'','description':'', 'business':this.props.business_id, 'valid_until':'', 'number_of_redeems_available':0, 'main_image':''};

    this.dealCallback = this.dealCallback.bind(this);
  }

    componentDidMount() {
      if (this.props.deal_id) {
        console.log("Business Id Is A Thing!")
        ajaxWrapper('GET','/api/home/deal/' + this.props.deal_id + '/', {}, this.dealCallback)
      }
    }

    dealCallback(result) {
      var business = result[0]['deal']
      business['business'] = business['business_id']
      this.setState(business)
    }

    render() {
        var Components = [TextInput, Select, TextArea, DateTimePicker, NumberInput, NumberInput, PhotoInput];
        var name = {'value':'','name':'name','label':'Name','placeholder': 'Patron Gate', 'required':true}
        var type = {'value':'', 'name':'type', 'label':'Type Of Deal', 'options':[{'value':'Drink Deal','text':'Drink Deal'},{'value':'Food Deal','text':'Food Deal'}]}
        var description = {'value':'','name':'description','label':'Description','placeholder': 'We are a Vikings bar! Make sure you are here for the game on Sunday!'}
        var valid_until = {'value':'', 'name':'valid_until', 'label':'Date the Deal is Valid Until. Leave Blank For Always Available.', 'display_time':false}
        var number_of_total_redeems_available = {'value':0, 'name':'number_of_total_redeems_available', 'label':'Number of times this coupon can be redeemed in total. Keep at 0 for unlimited.'}
        var number_of_redeems_available = {'value':0, 'name':'number_of_redeems_available', 'label':'Number of times any one person can redeem this coupon. Keep at 0 for unlimited.'}
        var main_image = {'value':'', 'name':'main_image', 'label':'Display Image', 'multiple':false}
        var ComponentProps = [name, type, description, valid_until, number_of_total_redeems_available, number_of_redeems_available, main_image];
        var defaults = this.state;

        var title = <h2>Create A Deal</h2>
        var submitUrl = "/api/home/deal/";
        if (this.props.deal_id) {
          submitUrl += this.props.deal_id + '/';
          title = <h2>Edit A Deal</h2>
        }

        var deleteUrl = undefined;
        if (this.props.deal_id) {
          deleteUrl = submitUrl + 'delete/';
        }
        var deleteRedirectUrl = '/business/' + this.props.business_id + '/'

        var redirectUrl = "/deal/{id}/";

        var content = <div className="container">
        <MetaTags>
          <title>Create A Deal</title>
          <meta name="description" content="Create A New Local Deal" />
          <meta property="og:title" content="Create A New Deal" />
        </MetaTags>
                {title}
                <Form components={Components} redirectUrl={redirectUrl} componentProps={ComponentProps} submitUrl={submitUrl} deleteUrl={deleteUrl} deleteRedirectUrl={deleteRedirectUrl} defaults={defaults} objectName={'deal'} submitButtonType={'patron'} />
        </div>;


        return (
            <Wrapper loaded={true} content={content} />
             );
    }
}
export default DealForm;
