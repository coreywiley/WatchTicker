// CardSection.js
import React from 'react';
import {CardElement} from 'react-stripe-elements';

class StripeCard extends React.Component {
  render() {
    return (
        <div className="form-group">
            <label>
                Card details
            </label>
            <CardElement className="form-control" />

      </div>
    );
  }
}

export default StripeCard;