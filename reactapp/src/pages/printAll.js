import React, { Component } from 'react';

import ShopList from './shopList.js';
import PrepList from './prepList.js';
import PackList from './packList.js';
import DecorList from './decorList.js';

class NewMenuItem extends Component {

    render() {

        return (
          <div>
          <ShopList user_id={this.props.user_id} event_id={this.props.event_id} />
          <div style={{'display':'block','page-break-before':'always'}}></div>
          <PrepList user_id={this.props.user_id} event_id={this.props.event_id} />
          <div style={{'display':'block','page-break-before':'always'}}></div>
          <DecorList user_id={this.props.user_id} event_id={this.props.event_id} />
          <div style={{'display':'block','page-break-before':'always'}}></div>
          <PackList user_id={this.props.user_id} event_id={this.props.event_id} />
          </div>
        );
    }
}

export default NewMenuItem;
