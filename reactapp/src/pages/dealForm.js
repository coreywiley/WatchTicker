import React, { Component } from 'react';
import ajaxWrapper from "base/ajax.js";
import Wrapper from 'base/wrapper.js';

import {Form, TextInput, Select, PasswordInput, Navbar, NumberInput, GoogleAddress, TextArea} from 'library';

class DealForm extends Component {

  constructor(props) {
    super(props);
    this.state = {'name':'','description':'', 'business':this.props.business_id};

    this.dealCallback = this.dealCallback.bind(this);
  }

    componentDidMount() {
      if (this.props.deal_id) {
        console.log("Business Id Is A Thing!")
        ajaxWrapper('GET','/api/home/deal/' + this.props.deal_id + '/', {}, this.dealCallback)
      }
    }

    dealCallback(result) {
      console.log("Here", result)
      var business = result[0]['deal']
      business['business'] = business['business_id']
      console.log("Business",business)
      this.setState(business)
    }

    render() {
        var Components = [TextInput,TextArea];
        var name = {'value':'','name':'name','label':'Name','placeholder': 'Patron Gate', 'required':true}
        var description = {'value':'','name':'description','label':'Description','placeholder': 'We are a Vikings bar! Make sure you are here for the game on Sunday!'}

        var ComponentProps = [name, description];
        var defaults = this.state;

        var title = <h2>Create A Deal</h2>
        var submitUrl = "/api/home/deal/";
        if (this.props.deal_id) {
          submitUrl += this.props.deal_id + '/';
          title = <h2>Edit A Deal</h2>
        }


        var redirectUrl = "/business/" + this.props.business_id + '/';



        var content = <div className="container">
                {title}
                <Form components={Components} redirectUrl={redirectUrl} componentProps={ComponentProps} submitUrl={submitUrl} defaults={defaults} />
        </div>;


        return (
            <Wrapper loaded={true} content={content} />
             );
    }
}
export default DealForm;
