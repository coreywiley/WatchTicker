// index.js
import React from 'react';
import {StripeProvider} from 'react-stripe-elements';

import StripeElements from './stripeelements.js';

class StripeMain extends React.Component {
    render() {
      return (
        <StripeProvider apiKey="pk_test_oCmLc8Wx8u9qVWGDropyUVQv">
          <StripeElements {...this.props} />
        </StripeProvider>
      );
    }
}


export default StripeMain;