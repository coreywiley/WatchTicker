// CheckoutForm.js
import React from 'react';
import {injectStripe} from 'react-stripe-elements';
import ajaxWrapper from '../base/ajax.js';

import StripeCard from './stripecard.js';

class StripeForm extends React.Component {
    constructor(props) {
        super(props);
        this.stripeCallback = this.stripeCallback.bind(this);
    }

  handleSubmit = (ev) => {
    // We don't want to let default form submission happen here, which would refresh the page.
    ev.preventDefault();

    // Within the context of `Elements`, this call to createToken knows which Element to
    // tokenize, since there's only one in this group.
    this.props.stripe.createToken({name: this.props.user_name}).then(({token}) => {
      console.log('Received Stripe token:', token);
      ajaxWrapper("POST",'/stripe/', {'token':token.id, 'user_id':this.props.user_id, 'plan_id':this.props.plan_id}, this.stripeCallback);
    });

    // However, this line of code will do the same thing:
    //
    // this.props.stripe.createToken({type: 'card', name: 'Jenny Rosen'});

    // You can also use createSource to create Sources. See our Sources
    // documentation for more: https://stripe.com/docs/stripe-js/reference#stripe-create-source
    //
    // this.props.stripe.createSource({type: 'card', name: 'Jenny Rosen'});
  };

  stripeCallback(value) {
    console.log("Value", value)
    ajaxWrapper("POST",'/api/home/crashpad/' + this.props.crashpad_id +'/', {'stripe_subscription_id':value['subscription'], 'published':true}, this.postCallback);
  }

  postCallback(value) {
    window.location.href = '/myCrashpads/';
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <StripeCard />
        <button className="btn btn-success">Confirm order</button>
      </form>
    );
  }
}

export default injectStripe(StripeForm);