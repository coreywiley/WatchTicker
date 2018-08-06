import React, { Component } from 'react';
import ajaxWrapper from "base/ajax.js";
import Wrapper from 'base/wrapper.js';
import getComponent from '../componentResolver.js';

import StripeMain from 'library/stripemain.js';


class StripePayment extends Component {
    constructor(props) {
        super(props);
        this.state = {'user_name':'', 'plan_id':'', 'plan_name':''};

    }

    choosePlan(plan_id, plan_name) {
        this.setState({'plan_id':plan_id,'plan_name':plan_name})
    }

    render() {

         var stripe = <div></div>;
         if (this.state.plan_id != '') {

            stripe = <div><h3>Easily Pay With A Credit Card</h3><p>{this.state.plan_name} Plan</p><StripeMain {...this.props} plan_id={this.state.plan_id} /></div>

         }


        return (
            <div className="container">
            <div class="pricing-header px-3 py-3 pt-md-5 pb-md-4 mx-auto text-center">
              <h1 class="display-4">Choose Your Plan</h1>
              <p class="lead">Choose between advertising your crashpad on a monthly basis or save some money and go for a year upfront.</p>
            </div>
            <div class="card-deck mb-3 text-center">
                <div class="card mb-4 box-shadow">
                  <div class="card-header">
                    <h4 class="my-0 font-weight-normal">Monthly</h4>
                  </div>
                  <div class="card-body">
                    <h1 class="card-title pricing-card-title">$10 <small class="text-muted">/ mo</small></h1>
                    <ul class="list-unstyled mt-3 mb-4">
                      <li>List Your Crashpad on the website</li>
                      <li>Pay Monthly</li>
                    </ul>
                    <button type="button" class="btn btn-lg btn-block btn-primary" onClick={() => this.choosePlan('plan_DCXtus5V6hvaCs','Monthly')}>Pay Monthly</button>
                  </div>
                </div>

                <div class="card mb-4 box-shadow">
                  <div class="card-header">
                    <h4 class="my-0 font-weight-normal">Yearly</h4>
                  </div>
                  <div class="card-body">
                    <h1 class="card-title pricing-card-title">$100 <small class="text-muted">/ yr</small></h1>
                    <ul class="list-unstyled mt-3 mb-4">
                      <li>List Your Crashpad on the website</li>
                      <li>Pay Yearly and Save</li>
                    </ul>
                    <button type="button" class="btn btn-lg btn-block btn-primary" onClick={() => this.choosePlan('plan_DCXsINnGWuP58T','Yearly')}>Pay Yearly</button>
                  </div>
                </div>
              </div>


            {stripe}

            </div>

             );
    }
}
export default StripePayment;