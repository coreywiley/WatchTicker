import React, { Component } from 'react';
import ajaxWrapper from "base/ajax.js";
import Wrapper from 'base/wrapper.js';
import MetaTags from 'react-meta-tags';

import {Form, TextInput, Select, PasswordInput, Navbar, NumberInput, GoogleAddress, Button} from 'library';
import Card from 'projectLibrary/businessCard.js';
class CouponMetrics extends Component {

  constructor(props) {
    super(props);
    this.state = {'deals':[], filters:{'type':'', 'city':'', 'state':''}, 'loaded':false};

    this.dealCallback = this.dealCallback.bind(this);
  }

    componentDidMount() {

          if (this.props.business_id) {
            ajaxWrapper('GET','/api/home/deal/?related=redemptions&order_by=last_published&business=' + this.props.business_id, {}, this.dealCallback)
          }
          else {
            if (this.props.user.is_staff == true) {
              ajaxWrapper('GET','/api/home/deal/?related=redemptions,business&order_by=business,last_published', {}, this.dealCallback)
            }
          }

    }

    dealCallback(result) {
      var deals = [];
      for (var index in result) {
        deals.push(result[index]['deal'])
      }
      this.setState({deals:deals, loaded:true})
    }

    render() {
      if (this.state.loaded) {
        var tableRows = [];

        for (var index in this.state.deals) {
          var deal = this.state.deals[index];

        if (this.props.business_id) {
          tableRows.push(<tr>
              <td>{deal.name}</td>
              <td>{deal.redemptions.length}</td>
              <td>{deal.last_published}</td>
              </tr>)
        }
        else {
          if (this.props.user.is_staff == true) {
            tableRows.push(<tr>
                <td>{deal.business.name}</td>
                <td>{deal.name}</td>
                <td>{deal.redemptions.length}</td>
                <td>{deal.last_published}</td>
                </tr>)
          }
        }
      }

        if (this.props.business_id) {
          var tableHeaders = <tr>
            <th>Deal Name</th>
            <th>Number of Redemptions</th>
            <th>Last Published Date</th>
          </tr>
        }
        else {
          if (this.props.user.is_staff == true) {
            var tableHeaders = <tr>
              <th>Business Name</th>
              <th>Deal Name</th>
              <th>Number of Redemptions</th>
              <th>Last Published Date</th>
            </tr>
          }
        }



          var content = <div className="container">
          <MetaTags>
            <title>Business Metrics | PatronGate</title>
            <meta property="og:title" content="Business Metrics | PatronGate" />
          </MetaTags>
                  <h1>All Time Redemptions For Each Coupon</h1>
                  <br />
                  <table>
                    {tableHeaders}
                    {tableRows}
                  </table>

          </div>;
      }
      else {
        content = <div></div>
      }

        return (
            <Wrapper loaded={this.state.loaded} content={content} />
             );
    }
}
export default CouponMetrics;
