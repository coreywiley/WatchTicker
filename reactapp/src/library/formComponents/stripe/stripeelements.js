import React from 'react';
import {Elements} from 'react-stripe-elements';

import StripeForm from './stripeform.js';

class StripeElements extends React.Component {
  render() {
    return (
      <Elements>
        <StripeForm {...this.props} />
      </Elements>
    );
  }
}

export default StripeElements;