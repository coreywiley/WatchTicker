import React, { Component } from 'react';
import ajaxWrapper from "base/ajax.js";
import Wrapper from 'base/wrapper.js';

import {Form, TextInput, Select, PasswordInput, Navbar, NumberInput, GoogleAddress, TextArea, Link, Button} from 'library';

class Redemption extends Component {
    constructor(props) {
      super(props);
      this.state = {'deal':{'name':'', 'business':{'name':''}}, 'date':''};

      this.redemptionCallback = this.redemptionCallback.bind(this);
    }

    componentDidMount() {
        ajaxWrapper('GET','/api/home/redemption/' + this.props.redemption_id + '/?related=deal,deal__business', {}, this.redemptionCallback)
    }

    redemptionCallback(result) {
      var deal = result[0]['redemption']
      deal['loaded'] = true
      this.setState(deal)
    }


    render() {

        var content = <div className="container">
                <h2>Coupon: {this.state.deal.name}</h2>
                <p>{this.props.user.first_name} redeemed this coupon for {this.state.deal.business.name} on {this.state.date}</p>
        </div>;


        return (
            <Wrapper loaded={this.state.loaded} content={content} />
             );
    }
}
export default Redemption;
